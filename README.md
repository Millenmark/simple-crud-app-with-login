# Simple CRUD App with Login

A Next.js application that provides a simple CRUD (Create, Read, Update, Delete) interface for managing records, with user authentication.

## Prerequisites

Before running this application, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [MongoDB](https://www.mongodb.com/) (running locally on port 27017)

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd simple-crud-app-with-login
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Setup

1. Copy the environment file:

   ```bash
   cp .env.local.example .env.local
   ```

   Or create `.env.local` with the following variables:

   ```
   SESSION_SECRET=your-secret-key-here
   MONGODB_URI=mongodb://localhost:27017/simple-crud-app
   ```

2. Start MongoDB:
   - If using MongoDB Community Server, start it with:
     ```bash
     mongod
     ```
   - Or use MongoDB Compass or another MongoDB management tool to ensure the database is running.

## Running the Application

1. Start the development server:

   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically reload as you make changes to the code.

## Features

- User authentication with session management
- CRUD operations for records
- Responsive UI built with Tailwind CSS and shadcn/ui components
- MongoDB for data storage

## Notes

- **Authentication**: For simplicity, login credentials are static and there is no user table in the database for verification. In a production environment, implement proper user management with database-backed authentication.
- **File Storage**: Images are saved in the public folder for simplicity. In a real-world application, use a CDN service like Cloudinary for better performance and scalability.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
