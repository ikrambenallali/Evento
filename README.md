# Evento
# Event Reservation System 🎫

A comprehensive web application for managing events and reservations with role-based access control, built with modern technologies.

## 📋 Project Overview

This application allows organizations (training centers, companies, associations, coworking spaces) to manage events and reservations efficiently. It replaces manual processes (Excel spreadsheets, simple forms, email exchanges) with a centralized, secure, and automated system.

### Key Features

- **Event Management**: Create, modify, publish, and cancel events
- **Public Event Catalog**: Browse available events with real-time availability
- **Reservation System**: Complete reservation lifecycle (request, confirmation, refusal, cancellation)
- **Role-Based Access**: Admin and Participant roles with specific permissions
- **PDF Ticket Generation**: Download confirmation tickets for confirmed reservations

## 🏗️ Architecture

### Technology Stack

**Backend:**
- NestJS (TypeScript)
- MongoDB / PostgreSQL
- JWT Authentication
- PDFKit for ticket generation
- Jest for testing

**Frontend:**
- Next.js (TypeScript)
- Redux / Context API for state management
- React Testing Library
- Server-Side Rendering (SSR) for public pages
- Client-Side Rendering (CSR) for authenticated areas

**DevOps:**
- Docker & Docker Compose

## 👥 User Roles

### Admin
- Create, modify, publish, and cancel events
- View all reservations (by event or by participant)
- Confirm or refuse reservation requests
- Cancel any reservation
- Access dashboard with analytics

### Participant
- Browse published events
- View event details
- Make reservations
- View personal reservations
- Cancel own reservations
- Download PDF tickets for confirmed reservations

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker & Docker Compose
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ikrambenallali/Evento.git
cd Evento
```

2. **Set up environment variables**
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your configuration

# Frontend
cp frontend/.env.example frontend/.env.local
# Edit frontend/.env.local with your configuration
```

3. **Run with Docker (Recommended)**
```bash
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000

4. **Run without Docker**

Backend:
```bash
cd backend
npm install
npm run start:dev
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## 📁 Project Structure

```
Evento/
├── api/                 # NestJS Backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── events/         # Event management module
│   │   ├── reservations/   # Reservation module
│   │   ├── users/          # User module
│   │   ├── pdf/            # PDF generation module
│   │   └── common/         # Shared utilities, guards, filters
│   ├── test/               # E2E tests
│   └── Dockerfile
├── web/               # Next.js Frontend
│   ├── src/
│   │   ├── app/           # Next.js app directory
│   │   ├── components/    # React components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux/Context
│   │   └── types/         # TypeScript types
│   └── Dockerfile
# Documentation
│
│   ├── class-diagram.png
│  
├── docker-compose.yml
└── README.md
```

## 🧪 Testing

### Backend Tests
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e





## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes

## 📊 Business Rules

### Event Statuses
- **DRAFT**: Event is being created, not visible to participants
- **PUBLISHED**: Event is visible and available for reservations
- **CANCELED**: Event is canceled, no new reservations allowed

### Reservation Statuses
- **PENDING**: Reservation awaiting admin confirmation
- **CONFIRMED**: Reservation confirmed, user can download ticket
- **REFUSED**: Reservation refused by admin
- **CANCELED**: Reservation canceled by user or admin

### Validation Rules
- Only PUBLISHED events are visible to participants
- Cannot reserve a CANCELED or non-PUBLISHED event
- Cannot reserve a full event (capacity reached)
- Cannot have multiple active reservations for the same event
- PDF ticket only available for CONFIRMED reservations
- Event capacity is strictly enforced

