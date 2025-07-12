# Vending Machine API

This project is a RESTful API for a vending machine application, built with Node.js, Express, and TypeScript. It allows users to register as "buyers" or "sellers", manage products, and perform vending machine operations like depositing coins and buying products.

## Features

- **User Management**: Register, login, and manage users with roles (buyer/seller).
- **Product Management**: Sellers can create, update, and delete products.
- **Vending Machine Operations**: Buyers can deposit coins, buy products, and reset their deposit.
- **Authentication**: JWT-based authentication for secure endpoints.
- **Validation**: Request validation using Zod schemas.
- **API Documentation**: Automated Swagger/OpenAPI documentation.

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: Zod
- **Testing**: Jest, ts-jest
- **Linting & Formatting**: Biome
- **Logging**: Pino

## Prerequisites

- Node.js (v18 or later)
- pnpm
- MongoDB instance "Since this is a small project, we're using MongoDB instead of a relational (transactional) database. To ensure consistency, we can use a workflow engine like Temporal to coordinate operations."

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ahmedsamirsilim/vending-machine.git
cd vending-machine
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project and add the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
PORT=3000
```

### 4. Run the application

To start the development server with auto-reloading:

```bash
pnpm dev
```

The server will be running at `http://localhost:3000`.

## API Documentation

Once the server is running, you can access the interactive Swagger API documentation at:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Available Scripts

- `pnpm build`: Compiles the TypeScript code to JavaScript in the `dist/` directory.
- `pnpm dev`: Starts the development server with live reloading.
- `pnpm test`: Runs the test suite using Jest.
- `pnpm lint`: Lints the codebase using Biome.
- `pnpm format`: Formats the codebase using Biome.

## Project Structure

```
src/
├── users/         # User management module
├── products/      # Product management module
├── vending-machine/ # Core vending machine logic
├── middleware/    # Express middleware (auth, validation)
├── shared/        # Shared utilities, constants, and types
├── utils/         # Utility functions (e.g., Swagger config)
└── app.ts         # Express app setup and entry point
```
