# Concert Booking App

A full-stack **Modular Monolith** application designed for concert discovery and ticket booking. Built with **NestJS**, **Next.js**, and **Material UI**.

## 🏗 Architecture Overview

The application is structured as a **Modular Monolith**, striking a balance between development simplicity and domain separation.

### Backend (NestJS)
Built on a Clean Architecture inspired layered design:
- **Router (Controller)**: Manages HTTP entry points.
- **Handler/Service layer**: Orchestrates business logic and use cases.
- **Repository layer**: Abstracts data persistence (using an in-memory Mock Database).
- **Domain Modules**: strictly separate boundaries for `Concert` and `Reservation`.

### Frontend (Next.js)
A modern React application using:
- **App Router**: For optimized performance and routing.
- **Responsive Design**: Mobile-first approach using MUI and Tailwind CSS.
- **Admin & User Views**: Dedicated sections for managing concerts and making bookings.

---

## 🛠 Tech Stack & Libraries

### Backend
- **NestJS**: Foundations for modules and dependency injection.
- **class-validator**: Automated request validation.
- **Jest**: Core testing framework.

### Frontend
- **Next.js 15**: Modern React framework.
- **Material UI (MUI)**: Professional component library and icons.
- **Tailwind CSS**: Rapid layout and utility styling.
- **Axios**: Efficient API communication.

---

## 🚀 Getting Started

### 🐳 Run with Docker (Recommended)
The entire stack is containerized for zero-config setup:

```bash
docker-compose up --build
```
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

### 💻 Run Locally (Development)

#### Backend:
```bash
cd backend
npm install
PORT=8080 npm run start:dev
```

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Unit Tests

Backend logic is thoroughly tested with unit and E2E tests:

```bash
cd backend
npm run test          # Unit tests
npm run test:cov      # Coverage report
```

---

## 📁 Repository Structure
```text
.
├── backend          # NestJS Server
├── frontend         # Next.js UI
├── docker-compose.yml
└── README.md
```
