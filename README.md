# NestJS REST API with Authentication

A robust REST API built with NestJS, featuring JWT authentication, Prisma ORM, and PostgreSQL database.

## 🚀 Features

- **User Authentication**: Sign up and sign in with JWT tokens
- **Password Hashing**: Secure password storage using Argon2
- **JWT Authorization**: Protected routes with JWT guards
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: Request validation using class-validator
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
   DATABASE_URL="postgresql://postgres:123@localhost:5434/nest_api"
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

### Protected Routes

To access protected routes, include the JWT token in the Authorization header:
```http
Authorization: Bearer <your-access-token>
```

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── decorator/        # Custom decorators (GetUser)
│   ├── dto/              # Data Transfer Objects
│   ├── guard/            # JWT Guard
│   ├── strategy/         # JWT Strategy
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   └── auth.service.ts
├── prisma/               # Prisma module
│   ├── prisma.module.ts
│   └── prisma.service.ts
├── user/                 # User module
├── app.module.ts         # Root module
└── main.ts               # Application entry point
```

## 🔐 Security Features

- **Password Hashing**: Passwords are hashed using Argon2 before storage
- **JWT Tokens**: Secure token-based authentication
- **Input Validation**: All inputs are validated using class-validator
- **Error Handling**: Proper error messages for duplicate emails and invalid credentials
- **Password Exclusion**: Passwords are never returned in API responses

## 🗄️ Database

The project uses PostgreSQL with Prisma ORM. The database schema includes:

- **User Model**: id, name, email, password, createdAt, updatedAt

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
- **JWT** - JSON Web Tokens for authentication
- **Passport** - Authentication middleware
- **Argon2** - Password hashing
- **class-validator** - Validation library
- **TypeScript** - Type-safe JavaScript

## 🔧 Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token signing
- `PORT` - Server port (default: 3000)

### Prisma

- Schema location: `prisma/schema.prisma`
- Migrations: `prisma/migrations/`

## 📝 License

This project is licensed under the UNLICENSED license.

## 👤 Author

Your Name

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📞 Support

For support, email your-email@example.com or open an issue in the repository.
