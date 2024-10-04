# User Management System

A **User Management System** built using **React.js** for the frontend and **Node.js** for the backend, with **MongoDB** as the database. This project allows users to perform CRUD (Create, Read, Update, Delete) operations for managing user details including First Name, Last Name, Phone Number, Email, and Address.

## Features

- **Create User**: Add new user details with form validation.
- **Update User**: Edit existing user information.
- **Delete User**: Remove a user from the list.
- **View User List**: Toggle the user list's visibility.
- **Form Validation**: Ensure valid email and phone number format.
- **Responsive Design**: Adjusts to different screen sizes.
- **Notifications**: Displays success or error messages via `react-toastify`.

## Tech Stack

### Frontend

- **React.js**: Component-based frontend framework.
- **Axios**: For API requests to the backend.
- **Tailwind CSS**: For easy and modern styling.
- **React Toastify**: To display toast notifications.

### Backend

- **Node.js**: Server-side runtime environment.
- **Express.js**: Backend framework for creating APIs.
- **MongoDB**: NoSQL database for storing user information.
- **Mongoose**: ORM for MongoDB to model data.

## Installation

### Prerequisites

Ensure the following are installed on your system:

- **Node.js** (v12+)
- **MongoDB** (Local or MongoDB Atlas)

### Steps to Run Locally

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Mdsarfraz667/task1.git
   ```

2. **Install dependencies for both frontend and backend**:

   ```bash
   # Frontend setup
   cd client
   npm install

   # Backend setup
   cd server
   npm install
   ```

3. **Run the backend server**:

   ```bash
   cd server
   node app.js
   ```

4. **Run the React frontend**:
   In another terminal window, run the following:

   ```bash
   cd client
   npm run dev
   ```

5. **Access the application**:
   Open your browser and navigate to [http://localhost:5173/].

## API Endpoints

Here are the main API endpoints:

- **GET /users**: Fetch all users.
- **POST /users**: Create a new user.
- **PATCH /users/:id**: Update user by ID.
- **DELETE /users/:id**: Delete user by ID.
