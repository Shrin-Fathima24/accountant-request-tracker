# Accountant Request Tracker

## Overview

A full-stack application for recording accountant work requests, tracking status, and surfacing overdue work. Requests and reminders are stored in MongoDB.

## Features

- Create and view requests with required-field validation
- Update request status
- Sort requests by due date
- Detect overdue requests and calculate days overdue
- Generate in-app reminders automatically

## Tech Stack

React, Vite, plain CSS, JavaScript, Node.js, Express, MongoDB, Mongoose, node-cron, dotenv, and cors.

## Project Structure

- `client/src`: React interface and centralized API service
- `server/models`: Mongoose request and reminder models
- `server/controllers` and `server/routes`: request and reminder API
- `server/services`: shared overdue calculation
- `server/jobs`: scheduled reminder generation

## Prerequisites

- Node.js and npm
- MongoDB running locally, or a MongoDB Atlas connection URI

## Installation

```sh
cd server
npm install
cd ../client
npm install
```

## Environment Setup

Copy `server/.env.example` to `server/.env` and set the connection string:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/accountant_tracker
CLIENT_ORIGIN=http://localhost:5173
```

For Atlas, replace `MONGODB_URI` with your database URI. Keep `.env` private; it is ignored by Git.

## Running

Start MongoDB first. In one terminal:

```sh
cd server
npm run dev
```

In another terminal:

```sh
cd client
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`). The frontend uses `http://localhost:5000/api` by default; set `VITE_API_BASE_URL` in a client `.env` file to change it.

## API Endpoints

- `POST /api/requests` — create a request
- `GET /api/requests` — list requests by due date ascending
- `PATCH /api/requests/:id/status` — update status
- `GET /api/requests/overdue` — list active overdue requests and `daysOverdue`
- `GET /api/reminders` — list reminders, newest first
- `GET /api/health` — basic server health check

Successful list responses use `{ success, count, data }`; errors use `{ success: false, message }`.

## Automation

The node-cron job runs every minute. It uses the shared overdue service and creates one in-app reminder per overdue request per UTC calendar day. A unique MongoDB index on request and day prevents duplicates even if jobs overlap. Completed requests are excluded.

## What Works

Request creation, listing, status changes, due-date sorting, overdue detection, days-overdue calculation, scheduled in-app reminders, and a UI for viewing requests, overdue items, and reminders. Requests and reminders are stored in MongoDB.

## Future Improvements

Authentication and roles, email notifications, search and filtering, pagination, audit history, production deployment, and a richer notification system.

## Walkthrough Outline

1. Create a future-dated Open request and show it in the sorted list.
2. Change its status to In Progress, then Completed; point out the summary counts.
3. Create an Open request due yesterday and show it in Overdue Requests.
4. Wait for the next minute-based cron run, then show its in-app reminder (or refresh after the run).
5. Mark the overdue request Completed and show it leave the overdue list.
6. Open `GET /api/requests/overdue` and explain calendar-day comparison, sorting, and `daysOverdue`.

The prototype has no authentication or outbound notifications. The scheduled job starts after MongoDB connects, and reminders are deduplicated by UTC date.
