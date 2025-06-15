# Task Manager Application
Test project built with React, TypeScript, Redux Toolkit, and MirageJS for API mocking.

### Built project [link](https://andrew-demydenko.github.io/Task-Manager-Application/)

## Features

- CRUD operations for projects and tasks
- Task filtering by status and priority

## Tech Stack

- **React 18**
- **Redux Toolkit**
- **React Router**
- **MirageJS** - API mocking
- **Tailwind CSS**
- **Vite**

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build project
```bash
npm run build
```

## Database and Data

The application uses **MirageJS** to mock an API server:

- Data is stored in browser memory and lost on page refresh
- Pre-populated data is created on app startup
- Authentication uses localStorage for token storage
- Click button "Authorization" to login
