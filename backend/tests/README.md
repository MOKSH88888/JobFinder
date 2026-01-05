# Testing Guide

## Run Tests

```bash
cd backend
npm test
```

## Test Configuration

Tests use environment variables from `.env`:
- `MONGO_URI` - Database connection
- `TEST_API_URL` - API endpoint (defaults to http://localhost:5000)

## Test Coverage

The `auth.test.js` suite includes:
1. User registration
2. User login and JWT generation
3. Invalid login rejection
4. Duplicate registration prevention
5. Admin authentication
6. Invalid admin login rejection

## Adding Tests

Create new test files in `backend/tests/` following the existing pattern with supertest.
