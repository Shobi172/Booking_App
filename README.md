# MERN Stack Appointment Booking App

This is a simple MERN (MongoDB, Express, React, Node.js) stack application that allows users to book appointments based on available time slots.

## Features

- User Login: Users can log in using their email and OTP authentication.
- Calendar View: Users can view the calendar to see available dates for booking.
- Date Details: Users can navigate to a particular date and see the available time slots for that date.
- Booking: Users can book appointments in the available time slots (30 minutes or 1 hour).
- Cancellation: Users can cancel their booked appointments.

## Technologies Used

- React with Typescript: Frontend user interface built using React and Typescript.
- Node.js with Express: Backend server developed using Node.js and Express framework.
- MongoDB: Database used to store appointment and user data.

## Setup Instructions

### Prerequisites

- Node.js and npm should be installed on your system.
- MongoDB should be installed and running.

### Backend Setup

1. Clone the repository.

2. Navigate to the backend directory.

3. Install the dependencies:


`npm install`


1. Create a .env file in the backend directory and set the following environment variables:

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret_key

PORT=your_port

NODEMAILER_MAIL=your_nodemailer_email

NODEMAILER_PASS=your_nodemailer_password


1. Run the backend server:

npm start


The backend server will be running on `http://localhost:5000`.



## Frontend Setup

1. Navigate to the frontend directory.

2. Install the dependencies:

`npm install`

3. Run the frontend development server:

npm start

The frontend development server will be running on `http://localhost:3000`.


Running the App
Open your web browser and go to http://localhost:3000 to access the application.



### API Endpoints

The backend server exposes the following API endpoints:

- `POST /api/login`: User login with email and OTP.
- `GET /api/calendar`: Get available dates in the calendar.
- `GET /api/date/:date`: Get available time slots for a particular date.
- `POST /api/book-appointment`: Book an appointment in an available time slot.
- `POST /api/cancel-appointment`: Cancel a booked appointment.



