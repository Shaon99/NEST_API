# NestJS REST API with Authentication

A robust REST API built with NestJS, featuring JWT authentication, Prisma ORM, and PostgreSQL database.

## 🚀 Features

- **User Authentication**: Sign up and sign in with JWT tokens (24-hour expiration)
- **Password Hashing**: Secure password storage using Argon2
- **JWT Authorization**: Protected routes with JWT guards
- **User Management**: CRUD operations for user management
- **Database**: PostgreSQL with Prisma ORM
- **Input Validation**: Request validation using class-validator with conditional validation
- **Error Handling**: Professional error responses with field-level validation errors
- **TypeScript**: Full TypeScript support
- **Docker**: PostgreSQL database containerized with Docker Compose

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Docker and Docker Compose (for database)
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd nest-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:your-password@localhost:5434/your-db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=3000
   ```

4. **Start the database**
   ```bash
   docker compose up dev-db -d
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Generate Prisma Client**
   ```bash
   npx prisma generate
   ```

## 🏃 Running the Application

### Development Mode
```bash
npm run start:dev
```

The application will be available at `http://localhost:3000`

### Production Mode
```bash
npm run build
npm run start:prod
```

### Other Commands
```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test

# Run e2e tests
npm run test:e2e
```

## 📚 API Endpoints

### Authentication

#### Sign Up
```http
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

**Error Response (Duplicate Email):**
```json
{
  "statusCode": 403,
  "message": "Email already exists. Please use a different email address."
}
```

#### Sign In
```http
POST /auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Note:** JWT tokens expire after 24 hours.

#### Get Authenticated User
```http
GET /auth/me
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "id": "uuid",
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z"
}
```

### User Management (Protected Routes)

All user management endpoints require JWT authentication. Include the token in the Authorization header:
```http
Authorization: Bearer <your-access-token>
```

#### Get All Users
```http
GET /user/lists
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "john@example.com",
      "name": "John Doe",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

#### Get User by ID
```http
GET /user/:id
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "User retrieved successfully.",
  "data": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "createdAt": "2025-01-01T00:00:00.000Z",
    "updatedAt": "2025-01-01T00:00:00.000Z"
  }
}
```

#### Update User
```http
PUT /user/:id
Authorization: Bearer <your-access-token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "newpassword123"
}
```

**Note:** All fields are optional. Only provided fields will be updated. Password is automatically hashed.

**Response:**
```json
{
  "id": "uuid",
  "email": "jane@example.com",
  "name": "Jane Doe",
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

**Validation Rules:**
- `name`: Optional, must be a string if provided
- `email`: Optional, must be a valid email format if provided, must be unique
- `password`: Optional, must be at least 6 characters if provided

#### Delete User
```http
DELETE /user/:id
Authorization: Bearer <your-access-token>
```

**Response:**
```json
{
  "message": "User successfully deleted."
}
```

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── decorator/        # Custom decorators (GetUser)
│   ├── dto/              # Data Transfer Objects (AuthDto, SigninDto)
│   ├── guard/            # JWT Guard
│   ├── strategy/         # JWT Strategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── user/                 # User module
│   ├── dto/              # Data Transfer Objects (UpdateUserDto, DeleteUserDto)
│   ├── user.controller.ts
│   ├── user.module.ts
│   ├── user.service.ts
│   └── user.select.ts    # User select fields (excludes password)
├── prisma/               # Prisma module
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using Argon2 before storage
- **JWT Tokens**: Secure token-based authentication with 24-hour expiration
- **Input Validation**: All inputs are validated using class-validator with conditional validation
- **Error Handling**: Professional error messages for duplicate emails and invalid credentials
- **Password Exclusion**: Passwords are never returned in API responses (using Prisma select)
- **Protected Routes**: JWT guards protect sensitive endpoints
- **Email Uniqueness**: Email validation and duplicate checking

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM. The database schema includes:

- **User Model**: 
  - `id` (UUID, Primary Key)
  - `name` (String)
  - `email` (String, Unique)
  - `password` (String, Hashed)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)

## 🐳 Docker

The database runs in a Docker container. To manage it:

```bash
# Start database
docker compose up dev-db -d

# Stop database
docker compose down

# View logs
docker compose logs dev-db
```

## 📦 Technologies Used

- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **PostgreSQL** - Relational database
- **JWT** - JSON Web Tokens for authentication (24-hour expiration)
- **Passport** - Authentication middleware
- **Argon2** - Password hashing
- **class-validator** - Validation library with conditional validation
- **TypeScript** - Type-safe JavaScript

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 3000)

### JWT Configuration

- **Token Expiration**: 24 hours
- **Token Format**: Bearer token in Authorization header
- **Secret**: Configurable via `JWT_SECRET` environment variable

### Prisma

- Schema location: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`
- Password exclusion: Uses `select` to exclude password from queries

## 📝 Validation

The API uses class-validator for input validation:

- **Required Fields**: Validated when present
- **Optional Fields**: Only validated if provided (using `@ValidateIf`)
- **Email Format**: Validated using `@IsEmail`
- **Password Strength**: Minimum 6 characters
- **Error Format**: Field-level error messages grouped by field name

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov
```

## 📝 License

This project is licensed under the UNLICENSED license.

## 👤 Author

Your Name

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, open an issue in the repository.
