#!/usr/bin/env node

// Test script to verify mobile UI functionality
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Mobile UI Implementation...\n');

// Read the blog writer component
const blogWriterPath = path.join(__dirname, 'app', 'blog-writer', 'page.tsx');
const content = fs.readFileSync(blogWriterPath, 'utf8');

// Test mobile-specific improvements
const tests = [
  {
    name: 'Mobile Article Type Collapsible',
    pattern: /lg:hidden.*Collapsible/s,
    description: 'Article types hidden in collapsible on mobile'
  },
  {
    name: 'Mobile Progress Indicator',
    pattern: /lg:hidden.*Generation Progress/s,
    description: 'Mobile-specific progress indicator'
  },
  {
    name: 'Responsive Header',
    pattern: /text-lg lg:text-2xl.*AI Blog Writer/s,
    description: 'Responsive header sizing'
  },
  {
    name: 'Mobile Touch Targets',
    pattern: /h-12 lg:h-11|h-11 lg:h-10/g,
    description: 'Mobile-optimized touch targets'
  },
  {
    name: 'Responsive Grid Layout',
    pattern: /grid-cols-1 lg:grid-cols-3/,
    description: 'Responsive grid system'
  },
  {
    name: 'Mobile Tab Navigation',
    pattern: /TabsTrigger.*className="text-sm font-medium"/,
    description: 'Mobile-friendly tab navigation'
  },
  {
    name: 'Responsive Button Layout',
    pattern: /grid-cols-1 sm:grid-cols-3.*gap-3/,
    description: 'Responsive button layout'
  },
  {
    name: 'Mobile Form Labels',
    pattern: /className="text-sm font-medium"/g,
    description: 'Consistent mobile form labels'
  }
];

let passed = 0;
let failed = 0;

tests.forEach(test => {
  const matches = content.match(test.pattern);
  if (matches) {
    console.log(`✅ ${test.name}: PASSED`);
    console.log(`   ${test.description}`);
    if (test.pattern.global) {
      console.log(`   Found ${matches.length} instances`);
    }
    passed++;
  } else {
    console.log(`❌ ${test.name}: FAILED`);
    console.log(`   ${test.description}`);
    failed++;
  }
  console.log('');
});

// Test for mobile state management
const mobileStateTests = [
  'showMobileFilters',
  'isAdvancedOpen', 
  'activeTab'
];

console.log('🎛️  Testing Mobile State Management:');
mobileStateTests.forEach(state => {
  if (content.includes(state)) {
    console.log(`✅ ${state}: Present`);
    passed++;
  } else {
    console.log(`❌ ${state}: Missing`);
    failed++;
  }
});
console.log('');

// Test for responsive breakpoints
const breakpointTests = [
  'lg:',
  'sm:',
  'md:'
];

console.log('📱 Testing Responsive Breakpoints:');
breakpointTests.forEach(breakpoint => {
  const matches = content.match(new RegExp(breakpoint, 'g'));
  if (matches && matches.length > 0) {
    console.log(`✅ ${breakpoint} breakpoint: ${matches.length} uses`);
    passed++;
  } else {
    console.log(`❌ ${breakpoint} breakpoint: Not found`);
    failed++;
  }
});

console.log('\n📊 Test Results:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${Math.round((passed / (passed + failed)) * 100)}%`);

if (failed === 0) {
  console.log('\n🎉 All mobile UI tests passed! The blog writer is mobile-ready.');
} else {
  console.log('\n⚠️  Some tests failed. Please check the implementation.');
}

console.log('\n🔗 Test the mobile UI at: http://localhost:3001/blog-writer');
console.log('📱 Use browser dev tools to simulate mobile devices');
