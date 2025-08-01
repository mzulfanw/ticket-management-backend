# 🛡️ Ticket Management - Node.js Clean Architecture

A modular and scalable **Ticket Management System** built with **Express**, **MongoDB**, **TypeScript**, and designed following **Clean Architecture** principles.

---

## 🚀 Tech Stack

- **Runtime**: Node.js, TypeScript  
- **Web Framework**: Express.js  
- **Validation**: Zod  
- **Database**: MongoDB + Mongoose  
- **Authentication**: JWT (JSON Web Token)  
- **Testing**: Jest, Supertest  
- **Architecture**: Clean Architecture (Layered - Controller, Service, Repository, DTOs)  
- **Error Handling**: Centralized (via custom middleware)  
- **Environment Config**: `dotenv` + runtime validation using Zod

---

## 🗂️ Project Structure (Clean Architecture)
## 🗂️ Project Structure
```text
├── app.ts               # Express app configuration
├── server.ts            # Application entry point
├── constants/           # Static values (e.g., message templates)
├── domains/             # Core domain logic, grouped per feature/module
│   ├── auth/            # Authentication module
│   │   ├── application/ # Business logic (services/use-cases)
│   │   ├── dto/         # Zod DTOs for request/response validation
│   │   ├── interfaces/  # Express routes & controllers
│   │   ├── repository/  # Data access layer (MongoDB)
│   │   ├── domain/      # Entity and interface contracts
│   │   └── __tests__/   # Unit & integration tests for this module
│   └── ticket/          # Ticket management module (same structure)
│       └── __tests__/   # Tests for ticket-specific logic
├── middleware/          # Global middlewares (error handler, validation, async wrapper)
├── models/              # Mongoose schema definitions
├── routes/              # Route aggregator (combine all feature routes)
├── shared/              # Shared utilities (e.g., JWT service)
├── utils/               # Helpers (e.g., flatten zod error)
└── .env                 # Environment variables
s
```

🧪 **Tests are colocated per module** inside `__tests__` folders.  
There is **no global `tests/` directory** outside `domains/`.

---

## ⚙️ Environment Variables

Create a `.env` file in the root:

```bash
cp .env.example .env
```
The env vars are validated using Zod. Missing or invalid envs will crash the app at startup (unless NODE_ENV=test).

## ▶️ Running Localy (Without Docker)
1. Install dependencies
   ```bash
   npm install
   ```
2. Setup environment
   ```bash
   cp .env.example .env
   ```
3. Start MongoDB locally
   
   You need MongoDB running on mongodb://localhost:27017. You can install locally or use Docker:
   ```bash
   # Optional: run MongoDB via docker
     docker run -d -p 27017:27017 --name mongo mongo
   ```
4. Start the app
   ```bash
   npm run dev
   ```
5. Seed sample data (optional)
   ```bash
   npm run seed
   ```

## 🐳 Running with Docker
1. Start with Docker Compose
   ```bash
   docker-compose up --build
   ```
   This will spin up:

   The app container (on port 3000)

   MongoDB container (on mongodb://mongo:27017)

   #### Note: Update your .env file with
   ```bash
   MONGO_URI=mongodb://mongo:27017/ticket_system
   ```
2. Open API
   ```bash
   http://localhost:3000/api/v1
   ```

## 🧪 Running Tests
```bash
# Run all tests
npm run test

# watch mode 
npm run test:watch
```
Test cases are written using Jest and Supertest, and are colocated per module (__tests__ folder).

## 🧱 Clean Architecture Principles
- Modular by feature
- Independent layers (Controller ↔ Service ↔ Repository)
- Reusable DTOs
- No business logic in controller
- Unit tested per module

## 👤 Sample Credentials
After seeding, these users are available:

| Role | Email          | Password |
| ---- | -------------- | -------- |
| L1   | l1@example.com | password |
| L2   | l2@example.com | password |
| L3   | l3@example.com | password |
