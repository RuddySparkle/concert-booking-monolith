# Concert Booking Server (Modular Monolith)

## Overview & Architecture

This application is built using a Clean Modular Monolith Architecture over NestJS, strictly separating domain boundaries into individual modules (`Concert`, `Reservation`). 

Inside each module, the implementation adheres closely to the following layered design:
1. **Router (Controller)**: Handles HTTP routing, extracts headers and parameters. 
2. **Handler**: Acts as the use-case layer. Validates inputs, handles standard HTTP interactions, applies presentation-level decorators, and calls Service layer logic.
3. **Service (Core Logic)**: Focuses purely on business rules. It fetches dependencies, executes core computations, orchestrates multiple models, and performs the central orchestration.
4. **Repository (Data Access)**: Isolates database details. It executes CRUD functions on our abstract database layer and manages entity interfaces matching the database table structure.

We simulate a database memory using `src/db/mock-db.ts` to facilitate isolated development and testing.

## Local Setup & Configuration

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation
1. Install project dependencies:
```bash
npm install
```

### Running the App
There are multiple environments you can run the app in:
```bash
# development mode
npm run start

# watch mode (best for local development)
npm run start:dev

# production mode
npm run start:prod
```

### Authentication & Roles Guard
Since no robust user sign-in system was attached to this mock project backend, we use a simple header-based identification. Make sure to append your Mock User ID into the Authorization headers:
```
User-Id: <user-1 | admin-1>
```
The App contains global `AuthGuard` which binds a `req.user` based on the given Mock ID, and a `RolesGuard` to check user-level accessibility to endpoints marked with `@Roles`. 

## Packages & Libraries

Below is a breakdown of key dependencies added:
- **`@nestjs/common`, `@nestjs/core`**: The foundational components handling Dependency Injection, API Lifecycle, and Modules.
- **`class-validator` & `class-transformer`**: Added to enforce strictly typed and validated inputs (`CreateConcertDto`, `ReserveSeatDto`) at our Controller/Handler layer, stopping malformed data from ever touching core services.
- **`jest` & `@nestjs/testing`**: Integrated to facilitate full structural unit testing via nested mock providers.

## Running Unit Tests

Unit tests are written using `Jest`. The setup specifically provides 100% coverage reporting for our core Service layers (`concert.service.ts`, `reservation.service.ts`).

```bash
# Run tests
npm run test

# Run tests and generate coverage report
npm run test:cov

# Run specific tested suites iteratively
npm run test:watch
```
