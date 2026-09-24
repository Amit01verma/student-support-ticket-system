
# Student Support & Ticket Management System

A production-style MVP for managing student administrative support requests from creation through resolution.

**Live Demo:** https://student-support-ticket-system.vercel.app  
**Backend API:** https://student-support-ticket-system.onrender.com  
**Repository:** https://github.com/Amit01verma/student-support-ticket-system

---

## Overview

The Student Support & Ticket Management System helps students raise support requests and gives staff a structured workflow to own, prioritize, process, and resolve those requests.

The system focuses on:

- Clear ticket ownership
- Priority and status management
- SLA tracking and ageing
- Assignment to support staff
- Resolution and closure tracking
- Activity history
- Dashboard-level management visibility

This implementation was built as a practical MVP for the Edumerge Product Engineering Assignment – **Assignment 4: Student Support & Ticket Management**.

---

## Key Features

### Student workflow

- Create a support ticket
- Select category and priority
- View submitted tickets
- Search tickets by ticket ID, title, or description
- Filter tickets by status, priority, and category
- View ticket details, SLA, ownership, and activity history

### Staff/Admin workflow

- View the support queue
- Assign tickets to staff
- Change ticket priority
- Update ticket status
- Track SLA deadlines
- View ticket activity history
- Monitor workload through dashboard statistics

### Ticket lifecycle

Tickets support the following statuses:

`Open → Assigned → In Progress → Pending Student / Pending Staff → Resolved → Closed`

The system records important changes in the ticket activity timeline.

---

## SLA Rules

SLA deadlines are calculated automatically when a ticket is created based on priority:

| Priority | SLA |
|---|---:|
| Low | 72 hours |
| Medium | 48 hours |
| High | 24 hours |
| Urgent | 8 hours |

The remaining SLA time is displayed in the ticket list and ticket details.

---

## Dashboard

The dashboard provides an operational overview of the support workload, including:

- Total tickets
- Open tickets
- Assigned tickets
- In-progress tickets
- Pending student tickets
- Pending staff tickets
- Resolved tickets
- Closed tickets
- Urgent tickets
- Recent ticket activity

---

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- React Router

### Backend

- Node.js
- Express.js
- JavaScript
- Mongoose

### Database

- MongoDB Atlas

### Deployment

- Vercel — frontend
- Render — backend
- MongoDB Atlas — database

---

## Architecture

```text
                         ┌──────────────────────────┐
                         │          Vercel          │
                         │     React + Vite UI      │
                         └────────────┬─────────────┘
                                      │
                                      │ REST API
                                      ▼
                         ┌──────────────────────────┐
                         │         Render           │
                         │   Node.js + Express API  │
                         └────────────┬─────────────┘
                                      │
                                      │ Mongoose
                                      ▼
                         ┌──────────────────────────┐
                         │      MongoDB Atlas       │
                         │ Users / Tickets /        │
                         │ Ticket Activities        │
                         └──────────────────────────┘
```

---

## Data Model

### User

Stores:

- Name
- Email
- Role
- Department
- Timestamps

Roles supported:

- Student
- Staff
- Admin

### Ticket

Stores:

- Ticket ID
- Student
- Title
- Description
- Category
- Priority
- Status
- Assigned staff
- SLA deadline
- Resolved timestamp
- Closed timestamp
- Timestamps

### TicketActivity

Stores:

- Ticket reference
- Actor
- Action
- Message
- Timestamp

This provides an audit-style activity timeline for ticket changes.

---

## API Endpoints

### Tickets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/tickets` | Create a ticket |
| GET | `/api/tickets` | List/search/filter tickets |
| GET | `/api/tickets/:id` | Get ticket details |
| PATCH | `/api/tickets/:id` | Update ticket |
| GET | `/api/tickets/stats` | Get dashboard statistics |

### Users

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users/staff` | Get available staff/admin users |

---

## Important Product Decisions

### 1. Priority-driven SLA

Instead of treating every request equally, SLA duration is derived from priority. This makes urgent administrative requests visible and measurable.

### 2. Pending states

Two separate pending states are supported:

- `Pending Student` — action/information is required from the student
- `Pending Staff` — action is waiting on the support team

This avoids treating every pending ticket as the same type of blockage.

### 3. Activity history

Important ticket changes create activity entries so that the ticket has a traceable history instead of only showing its latest state.

### 4. Explicit assignment

A ticket can remain unassigned until a staff member takes ownership. This makes ownership visible instead of assuming that every ticket is immediately assigned.

---

## Assumptions

- The system is an MVP rather than a full enterprise helpdesk.
- Authentication is implemented as a lightweight demo authentication flow using frontend state/local storage; production authentication would use secure server-side authentication and authorization.
- Email/SMS notifications are outside the current scope.
- SLA escalation is represented through SLA tracking and dashboard visibility; automated notification/escalation jobs are outside the MVP scope.
- MongoDB Atlas is used as the persistent data store.
- Staff and admin users are managed as application records for the prototype.

---

## Validation & Edge Cases Considered

The implementation was tested around important failure scenarios, including:

- Invalid/non-existent ticket IDs
- Ticket creation with required fields
- Ticket assignment and reassignment
- Status transitions
- Priority changes
- SLA calculation
- Ticket activity creation
- Missing staff endpoint during development
- MongoDB connection/database configuration
- Production CORS configuration
- Client-side routing on Vercel
- Production frontend-to-backend API communication

The deployed application was also tested end-to-end through the Vercel frontend against the Render API and MongoDB Atlas.

---

## Local Development

### Prerequisites

- Node.js
- npm
- MongoDB Atlas account/database

### 1. Clone the repository

```bash
git clone https://github.com/Amit01verma/student-support-ticket-system.git
cd student-support-ticket-system
```

### 2. Backend

```bash
cd backend
npm install
```

Create:

```text
backend/.env
```

using `backend/.env.example` as a reference.

Then start the backend:

```bash
npm start
```

The API runs on the configured backend port.

### 3. Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create:

```text
frontend/.env
```

using `frontend/.env.example` as a reference.

Set the API base URL to the backend URL, for example:

```text
VITE_API_URL=http://localhost:5000/api
```

Then run:

```bash
npm run dev
```

---

## Project Structure

```text
student-support-ticket-system/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Deployment

### Frontend

The React/Vite application is deployed on Vercel.

Live application:

https://student-support-ticket-system.vercel.app

### Backend

The Node/Express API is deployed on Render.

API base URL:

https://student-support-ticket-system.onrender.com

### Database

MongoDB Atlas provides the production database used by the deployed backend.

---

## Trade-offs & Future Improvements

This MVP intentionally keeps the scope focused on the core ticket workflow.

Potential future improvements include:

- Secure JWT/session-based authentication
- Role-based server-side authorization
- Automated SLA escalation and notifications
- Email notifications
- Pagination for large ticket queues
- Attachment support
- Advanced analytics and reporting
- Bulk ticket operations
- More granular audit logs
- Automated tests and CI/CD
- Rate limiting and additional API security

---

---

## Author

**Amit Kumar**

Built with React, Node.js, Express, and MongoDB.
