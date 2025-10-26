import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			// Prowriter Brand Colors
  			brand: {
  				blue: {
  					50: '#EFF6FF',
  					100: '#DBEAFE',
  					200: '#BFDBFE',
  					300: '#93C5FD',
  					400: '#60A5FA',
  					500: '#3B82F6',
  					600: '#2563EB',
  					700: '#1D4ED8',
  					800: '#1E40AF',
  					900: '#1E3A8A',
  				},
  				purple: {
  					50: '#FAF5FF',
  					100: '#F3E8FF',
  					200: '#E9D5FF',
  					300: '#D8B4FE',
  					400: '#C084FC',
  					500: '#A855F7',
  					600: '#9333EA',
  					700: '#7E22CE',
  					800: '#6B21A8',
  					900: '#581C87',
  				},
  				slate: {
  					50: '#F8FAFC',
  					100: '#F1F5F9',
  					200: '#E2E8F0',
  					300: '#CBD5E1',
  					400: '#94A3B8',
  					500: '#64748B',
  					600: '#475569',
  					700: '#334155',
  					800: '#1E293B',
  					900: '#0F172A',
  				}
  			}
  		},
  		backgroundImage: {
  			'gradient-primary': 'linear-gradient(135deg, #2563EB 0%, #9333EA 100%)',
  			'gradient-page': 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 50%, #EFF6FF 100%)',
  			'gradient-card': 'linear-gradient(135deg, #EFF6FF 0%, #F3E8FF 100%)',
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
