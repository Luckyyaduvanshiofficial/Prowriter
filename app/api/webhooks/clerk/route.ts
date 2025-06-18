import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'

// You can get this from the Clerk Dashboard -> Webhooks -> Choose your webhook -> Signing Secret
const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

if (!WEBHOOK_SECRET) {
  throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local')
}

type EventType = 'user.created' | 'user.updated' | 'user.deleted' | '*'

type Event = {
  data: Record<string, any>
  object: 'event'
  type: EventType
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: Event

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as Event
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  console.log(`Webhook with an ID of ${evt.data.id} and type of ${eventType}`)

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data

    // Here you can save user data to your database
    // For now, we'll just log it
    console.log('User created:', {
      id,
      email: email_addresses[0]?.email_address,
      firstName: first_name,
      lastName: last_name,
    })

    // You can also set default user metadata here
    // This would typically involve saving to your database
    // and potentially updating the user's publicMetadata in Clerk
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name } = evt.data

    console.log('User updated:', {
      id,
      email: email_addresses[0]?.email_address,
      firstName: first_name,
      lastName: last_name,
    })
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data

    console.log('User deleted:', { id })
    
    // Here you would clean up user data from your database
  }

  return new Response('', { status: 200 })
}
