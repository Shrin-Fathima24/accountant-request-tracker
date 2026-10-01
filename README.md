# Accountant Request Tracker

## Overview

A simple full-stack application for creating and tracking accountant work requests, updating their status, and identifying overdue work.

Requests and in-app reminders are stored in MongoDB.

## Features

- Create requests with title, client name, assignee, due date, and status
- View all requests sorted by due date
- Update request status
- Detect overdue open requests and calculate days overdue
- Automatically generate in-app reminders for overdue requests
- Prevent duplicate reminders for the same request on the same day

## Tech Stack

- React
- Vite
- JavaScript
- Plain CSS
- Node.js
- Express
- MongoDB
- Mongoose
- node-cron
- dotenv
- cors

## Project Structure

- `client/src` — React interface and centralized API service
- `server/models` — Mongoose request and reminder models
- `server/controllers` and `server/routes` — API controllers and routes
- `server/services` — shared overdue calculation logic
- `server/jobs` — scheduled reminder generation

## Prerequisites

- Node.js and npm
- MongoDB running locally, or a MongoDB Atlas connection URI

## Installation

Install the server dependencies:

```bash
cd server
npm install
```

Install the client dependencies:

```bash
cd ../client
npm install
```

## Environment Setup

Copy `server/.env.example` to `server/.env` and configure the database connection:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/accountant_tracker
CLIENT_ORIGIN=http://localhost:5173
```

For MongoDB Atlas, replace `MONGODB_URI` with your Atlas connection URI.

Keep `.env` private. It is ignored by Git and should not be committed.

## Running the Application

Start MongoDB first.

In one terminal:

```bash
cd server
npm run dev
```

In another terminal:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

The frontend uses:

```text
http://localhost:5000/api
```

as the default API URL.

To change the API URL, set `VITE_API_BASE_URL` in the client environment configuration.

## API Endpoints

- `POST /api/requests` — create a request
- `GET /api/requests` — list requests sorted by due date ascending
- `PATCH /api/requests/:id/status` — update request status
- `GET /api/requests/overdue` — list active overdue requests with `daysOverdue`
- `GET /api/reminders` — list generated reminders, newest first
- `GET /api/health` — basic server health check

Successful list responses use:

```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

Errors use:

```json
{
  "success": false,
  "message": "Error message"
}
```

## Overdue Automation

The application uses `node-cron` to run a scheduled job every minute.

The job:

1. Checks for open requests whose due date has passed.
2. Uses the shared overdue calculation service.
3. Creates an in-app reminder for each overdue request.
4. Prevents duplicate reminders for the same request on the same UTC calendar day.
5. Excludes completed requests.

A unique MongoDB index on the request and reminder date provides additional protection against duplicate reminders.

The prototype generates **in-app reminders only**; it does not send external emails or notifications.

## What Works

The prototype supports:

- Request creation
- Request listing
- Status updates
- Due-date sorting
- Overdue detection
- Days-overdue calculation
- Scheduled in-app reminders
- Viewing overdue requests and reminders
- MongoDB persistence

No real client data is included.

## Future Improvements

With more time, I would consider adding:

- Authentication and user roles
- Email notifications
- Search and filtering
- Pagination
- Audit history
- More automated tests
- Production deployment
- A richer notification system

## Walkthrough Outline

1. Create a future-dated Open request and show it in the sorted list.
2. Update its status to In Progress and then Completed.
3. Create an Open request with a past due date and show it in Overdue Requests.
4. Wait for the scheduled job to run and show the generated in-app reminder.
5. Mark the overdue request as Completed and show that it is removed from the overdue list.
6. Open `GET /api/requests/overdue` and explain the overdue calculation, sorting, and `daysOverdue` logic.

## Notes

This is a prototype focused on the requested functionality rather than production features.

The scheduled reminder job starts after MongoDB connects. Reminders are stored in MongoDB and deduplicated by request and UTC calendar day.
