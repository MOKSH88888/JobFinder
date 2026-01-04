# Running Tests

## Setup

Install the test dependency (supertest):

```bash
cd backend
npm install --save-dev supertest
```

## Run Tests

```bash
npm test
```

This will run the authentication tests against your local or deployed API.

## Test Configuration

Tests use the following environment variables from your `.env` file:
- `MONGO_URI` - Database connection (uses test database if available)
- `TEST_API_URL` - API endpoint (defaults to http://localhost:5000)

## What's Tested

The auth.test.js file includes:
1. ✅ User registration
2. ✅ User login
3. ✅ Invalid login rejection
4. ✅ Duplicate registration prevention
5. ✅ Admin login
6. ✅ Invalid admin login rejection

## Adding More Tests

To add more tests, create new files in the `backend/tests/` directory following the same pattern.
