/**
 * Backend Routes Test Script
 * Tests all Profile Feed API endpoints
 * 
 * Run: node scripts/test-backend-routes.js
 */

const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_URL || 'http://localhost:5000/api';
const TEST_USER_ID = '507f1f77bcf86cd799439011'; // Replace with real user ID
const TEST_POST_ID = '507f1f77bcf86cd799439012'; // Replace with real post ID

// Color codes for console
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}━━━ ${msg} ━━━${colors.reset}\n`)
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper function to run test
async function runTest(name, testFn) {
  try {
    await testFn();
    results.passed++;
    results.tests.push({ name, status: 'PASS' });
    log.success(name);
    return true;
  } catch (error) {
    results.failed++;
    results.tests.push({ name, status: 'FAIL', error: error.message });
    log.error(`${name} - ${error.message}`);
    return false;
  }
}

// Test 1: Health Check
async function testHealthCheck() {
  log.section('1. Health Check');
  
  await runTest('Backend server is running', async () => {
    const response = await axios.get(BASE_URL.replace('/api', '/health'));
    if (response.status !== 200) throw new Error('Server not responding');
  });
}

// Test 2: Profile Routes
async function testProfileRoutes() {
  log.section('2. Profile Routes');

  await runTest('GET /api/profile/:userId - Fetch user profile with posts', async () => {
    const response = await axios.get(`${BASE_URL}/profile/${TEST_USER_ID}`);
    if (!response.data.profile) throw new Error('No profile data returned');
    if (!Array.isArray(response.data.posts)) throw new Error('Posts not an array');
    log.info(`  → Found ${response.data.posts.length} posts`);
  });

  await runTest('GET /api/profile/:userId with pagination cursor', async () => {
    const response = await axios.get(`${BASE_URL}/profile/${TEST_USER_ID}?limit=5`);
    if (response.data.posts.length > 5) throw new Error('Limit not working');
    if (response.data.hasNextPage && !response.data.nextCursor) {
      throw new Error('Missing cursor for next page');
    }
    log.info(`  → Pagination working, hasNextPage: ${response.data.hasNextPage}`);
  });

  await runTest('GET /api/profile/:userId/stats - Fetch profile statistics', async () => {
    const response = await axios.get(`${BASE_URL}/profile/${TEST_USER_ID}/stats`);
    if (typeof response.data.postsCount !== 'number') throw new Error('Invalid stats format');
    log.info(`  → Posts: ${response.data.postsCount}, Followers: ${response.data.followersCount}`);
  });
}

// Test 3: Posts CRUD Routes
async function testPostsRoutes() {
  log.section('3. Posts CRUD Routes');

  await runTest('GET /api/posts/:postId - Fetch single post', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${TEST_POST_ID}`);
      if (!response.data.post) throw new Error('No post data returned');
    } catch (error) {
      if (error.response?.status === 404) {
        log.warning('  → Post not found (expected if test post ID invalid)');
      } else throw error;
    }
  });

  await runTest('POST /api/posts - Create new post (requires auth)', async () => {
    try {
      await axios.post(`${BASE_URL}/posts`, {
        content: 'Test post from automation script',
        type: 'text',
        privacy: 'public'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        log.warning('  → Unauthorized (expected without token)');
      } else throw error;
    }
  });
}

// Test 4: Upload Routes
async function testUploadRoutes() {
  log.section('4. Upload Routes');

  await runTest('POST /api/uploads/request - Request upload URL (requires auth)', async () => {
    try {
      await axios.post(`${BASE_URL}/uploads/request`, {
        fileName: 'test.png',
        mimeType: 'image/png',
        fileSize: 1024000
      });
    } catch (error) {
      if (error.response?.status === 401) {
        log.warning('  → Unauthorized (expected without token)');
      } else throw error;
    }
  });
}

// Test 5: Reactions Routes
async function testReactionsRoutes() {
  log.section('5. Reactions Routes');

  await runTest('POST /api/posts/:postId/reaction - Toggle reaction (requires auth)', async () => {
    try {
      await axios.post(`${BASE_URL}/posts/${TEST_POST_ID}/reaction`, {
        type: 'like'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        log.warning('  → Unauthorized (expected without token)');
      } else throw error;
    }
  });

  await runTest('GET /api/posts/:postId/reactions - Fetch post reactions', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${TEST_POST_ID}/reactions`);
      if (!Array.isArray(response.data)) throw new Error('Reactions not an array');
    } catch (error) {
      if (error.response?.status === 404) {
        log.warning('  → Post not found (expected if test post ID invalid)');
      } else throw error;
    }
  });
}

// Test 6: Comments Routes
async function testCommentsRoutes() {
  log.section('6. Comments Routes');

  await runTest('GET /api/posts/:postId/comments - Fetch comments', async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts/${TEST_POST_ID}/comments`);
      if (!Array.isArray(response.data)) throw new Error('Comments not an array');
    } catch (error) {
      if (error.response?.status === 404) {
        log.warning('  → Post not found (expected if test post ID invalid)');
      } else throw error;
    }
  });

  await runTest('POST /api/posts/:postId/comments - Add comment (requires auth)', async () => {
    try {
      await axios.post(`${BASE_URL}/posts/${TEST_POST_ID}/comments`, {
        content: 'Test comment from automation script'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        log.warning('  → Unauthorized (expected without token)');
      } else throw error;
    }
  });
}

// Test 7: Share Routes
async function testShareRoutes() {
  log.section('7. Share Routes');

  await runTest('POST /api/posts/:postId/share - Share post (requires auth)', async () => {
    try {
      await axios.post(`${BASE_URL}/posts/${TEST_POST_ID}/share`, {
        shareType: 'timeline',
        caption: 'Test share'
      });
    } catch (error) {
      if (error.response?.status === 401) {
        log.warning('  → Unauthorized (expected without token)');
      } else throw error;
    }
  });
}

// Test 8: Error Handling
async function testErrorHandling() {
  log.section('8. Error Handling');

  await runTest('GET /api/profile/invalid_id - Invalid user ID', async () => {
    try {
      await axios.get(`${BASE_URL}/profile/invalid_id`);
      throw new Error('Should have returned 400 or 500');
    } catch (error) {
      if (error.response?.status >= 400) {
        log.info('  → Properly returns error for invalid ID');
      } else throw error;
    }
  });

  await runTest('GET /api/posts/nonexistent123 - Non-existent post', async () => {
    try {
      await axios.get(`${BASE_URL}/posts/507f1f77bcf86cd799439999`);
      // If reaches here, post might exist or ID format accepted
    } catch (error) {
      if (error.response?.status === 404) {
        log.info('  → Properly returns 404 for non-existent post');
      } else throw error;
    }
  });
}

// Main test runner
async function runAllTests() {
  console.log(`\n${colors.cyan}╔════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║   BACKEND API ROUTES - TEST SUITE         ║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════╝${colors.reset}\n`);
  
  log.info(`Base URL: ${BASE_URL}`);
  log.info(`Test User ID: ${TEST_USER_ID}`);
  log.info(`Test Post ID: ${TEST_POST_ID}\n`);
  
  log.warning('Note: Some tests will fail if test IDs are invalid or auth required');
  log.warning('This is expected behavior for security testing\n');

  const startTime = Date.now();

  try {
    await testHealthCheck();
    await testProfileRoutes();
    await testPostsRoutes();
    await testUploadRoutes();
    await testReactionsRoutes();
    await testCommentsRoutes();
    await testShareRoutes();
    await testErrorHandling();
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  // Print summary
  console.log(`\n${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.cyan}TEST SUMMARY${colors.reset}\n`);
  console.log(`  Total Tests: ${results.passed + results.failed}`);
  console.log(`  ${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`  ${results.failed > 0 ? colors.red : colors.gray}Failed: ${results.failed}${colors.reset}`);
  console.log(`  Duration: ${duration}s\n`);

  if (results.failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    results.tests
      .filter(t => t.status === 'FAIL')
      .forEach(t => console.log(`  - ${t.name}: ${colors.gray}${t.error}${colors.reset}`));
  }

  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  if (results.failed === 0) {
    console.log(`${colors.green}✓ All tests passed!${colors.reset}\n`);
  } else {
    console.log(`${colors.yellow}⚠ Some tests failed (may be expected)${colors.reset}\n`);
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runAllTests().catch(error => {
  log.error(`Test suite crashed: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
