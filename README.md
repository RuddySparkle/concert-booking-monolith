# Concert Booking App

A full-stack modular monolith built with **NestJS** and **Next.js**. 

## Requirements
- Docker and Docker Compose

## Getting Started

1. Start the application using docker-compose from the root directory:
```bash
docker-compose up --build
```
Or to run in detached mode:
```bash
docker-compose up -d --build
```

2. Once the containers are successfully running, the services will be available:
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)

## Accessing the UI
Since this has been designed responsively with MUI, open [http://localhost:3000](http://localhost:3000) in your mobile or desktop browser to enjoy the admin interface handling API interactions locally with the containerized backend. Total seats, ticket history logic, and cancellations correctly interact with the Node.js service using an admin mock user ID bound directly in the requests over Docker network boundaries.

## Architecture 
You can refer to the [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md) for each service architecture.
