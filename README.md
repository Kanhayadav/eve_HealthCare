# EVE Healthcare Backend

Backend API for diagnostic test bookings and simulated payment processing.

Built as part of the EVE Healthcare SDE Intern Backend Engineering Assignment.

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- JWT
- bcrypt
- Zod
- Docker
- Jest + Supertest

## Features

- User signup, login and logout
- JWT-based authentication
- Diagnostic centre and test APIs
- Centre-test pricing
- Paginated centre listing
- Authenticated diagnostic test booking
- Appointment validation
- Simulated payment processing
- Payment webhook handling
- Idempotent webhook processing
- Booking status management
- PostgreSQL database
- Docker support
- Authentication tests

---

## Design Decisions

### Database

I used PostgreSQL because the application has clear relationships between users, diagnostic centres, tests, bookings and payments.

The main tables are:

- `users` — user accounts and hashed passwords
- `centres` — diagnostic centre details
- `tests` — available diagnostic tests
- `centre_tests` — connects centres and tests and stores the price
- `bookings` — appointment and booking details
- `payments` — payment attempts and webhook events

I used `centre_tests` as a junction table because one centre can offer multiple tests and the same test can be available at multiple centres. The price is stored here because different centres can have different prices for the same test.

### Booking & Payment Flow

A new booking starts with `PENDING` status.

```text
Booking
   ↓
PENDING
   ↓
Payment
 ┌───────────────┐
 ↓               ↓
SUCCESS        FAILED
 ↓               ↓
CONFIRMED       FAILED
```

The booking amount is fetched from the database instead of being accepted from the client.

Payments are simulated as required by the assignment. Webhooks use a unique `eventId` so duplicate webhook events are ignored.

### Authentication & Validation

I used JWT authentication with HTTP-only cookies and bcrypt for password hashing+salting.

Zod is used to validate request bodies before processing them.

Protected APIs require authentication, and users can only access their own bookings.

### Pagination

The centre API supports pagination using `page` and `limit`.

```text
offset = (page - 1) × limit
```

---

## Assumptions

- Payments are simulated and do not use a real payment gateway.
- Appointment times must be in the future.
- A test can only be booked if the selected centre offers it.
- The booking price is determined by the server.
- Successful payment confirms the booking.
- Failed payment marks the booking as failed.
- `eventId` is unique for each payment event.
- PostgreSQL is used as the primary database.
- Added Hashing + salting for better security

---

## Improvements With More Time

- Add more unit and integration tests.
- Add centralized error handling and structured logging.
- Add Redis caching.
- Move payment processing to a background queue.
- Add database migrations or change to mongo DB for future changes as the system would require schema updates
- If PostGres is mandatory then will add Prisma ORM to make my Life as lil easy for migrations 
- Add production deployment and monitoring.
- Migrate to a Turpo-repo

---

## Project Structure

```text
.
├── src/
│   ├── config/
│   ├── docs/
│   ├── middlewares/
│   ├── routes/
│   ├── app.ts
│   └── index.ts
├── tests/
│   └── auth.test.ts
├── sql/
│   ├── schema.sql
│   └── seed.sql
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── package.json
├── package-lock.json
└── tsconfig.json
```

---

## Testing

Run the test suite with:

```bash
npm test
```

The current test suite covers authentication flows including:

- Successful signup
- Duplicate email handling
- Invalid login credentials
- Invalid signup input

---

## Docker

Build the backend image:

```bash
docker build -t eve-healthcare .
```

Run PostgreSQL using Docker Compose:

```bash
docker compose up -d
```

---

## API Endpoints

### Authentication

```text
POST /api/v1/auth/signup
POST /api/v1/auth/login
POST /api/v1/auth/logout
```

### Diagnostic Centres

```text
GET /api/v1/centre?page=1&limit=10
```

### Booking

```text
POST /api/v1/booking
```

Example:

```json
{
  "centreId": 1,
  "testId": 1,
  "appointmentAt": "2026-10-20T10:00:00Z"
}
```

### Payment

```text
POST /api/v1/payments
```

Example:

```json
{
  "bookingId": 11
}
```

### Payment Webhook

```text
POST /api/v1/payments/webhook
```

Example:

```json
{
  "eventId": "evt_12345",
  "bookingId": 11,
  "status": "SUCCESS"
}
```

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file using `.env.example`:

```env
DB_USER=admin
DB_HOST=localhost
DB_NAME=eveDB
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
JWT_SECRET=your_jwt_secret
```

### 3. Start PostgreSQL

```bash
docker compose up -d
```

### 4. Initialize the database

```bash
docker exec -i practical_galois psql -U admin -d eveDB < sql/schema.sql
```

### 5. Seed sample data

```bash
docker exec -i practical_galois psql -U admin -d eveDB < sql/seed.sql
```

### 6. Start the server

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

---

## Author

**Kanha Yadav**

Built for the EVE Healthcare SDE Intern Backend Engineering Assignment.
