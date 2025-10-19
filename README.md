<h1 align="center">UREP Backend Server</h1>
<hr>

<h2 bold>Overview</h3>
UREP Backend Server is a robust and scalable backend solution designed to support the UREP application. 
It provides essential APIs and services to manage user data, authentication, and other core functionalities required by the UREP platform.
<hr>

<h1>Features</h1>
- Admin authentication and authorization
- User registration and management
- User authentication and authorization
- Programme management
- Statistics and reporting
- Secure API endpoints
- Integration with external services and APIs
<hr>

# Program Flow and Architecture

## Program Flow
The UREP Backend Server has the following program flow:

**Admin**
- Only accounts with admin role can access admin protected routes.
- Admin can create, read, update, and delete programmes.
- Admin can view statistics and reports.

**User**
- Users have various registrations which include UREP registration and programme registration.
- Users can view their profile and programmes they are registered in.

**Programme**
- Programmes are created by admins and can be registered by users.
- Programmes can be active either when activated by admin or when the current date is within the programme's start and end dates.
- Users can register for active programmes.
- Users can view their programme registrations.
- Statistics on programme registrations can be viewed by admins.
- Registration can only happen when the programme is active.
<hr>

## Architecture and Technologies Used
### Technologies
The UREP Backend Server is built using the following technologies:
- **Node.js**
- **PNPM Package Manager**
- **NestJS Framework**
- **TypeScript**
- **PostgreSQL Database**
- **Drizzle ORM**
- **JWT for Authentication**
- **Gmail SMTP for Email Services**
- **RESTful API Design**
- **Docker for Containerization**
- **Swagger for API Documentation**
- **CI/CD Pipelines for Automated Deployment**
- **Unit and Integration Testing with Jest**
- **Google Cloud Platform for Hosting and Services**
- **Environment Variables for Configuration Management**
<hr>

### Architecture
The architecture of the UREP Backend Server follows a modular design pattern, ensuring separation of concerns and scalability. The main components include:
- **Controllers**: Handle incoming HTTP requests and route them to the appropriate services.
- **Services**: Contain the business logic and interact with the database through repositories.
- **Modules**: Organize the application into cohesive units, grouping related controllers and services.
- **Repositories**: Manage data access and database operations using Drizzle ORM.
- **Entities/Models**: Define the data structures and relationships in the PostgreSQL database.
- **Middleware**: Implement cross-cutting concerns such as authentication, logging, and error handling.
- **Configuration**: Manage environment-specific settings and secrets securely.
- **Guard**: Implement role-based access control for protected routes.
- **Decorators**: Add metadata to classes and methods for features like validation and serialization.
- **DTOs (Data Transfer Objects)**: Define the shape of data sent over the network

### Database Design
TODO: Add ER Diagram and explanation of tables and relationships.
<hr>

### Architecture Diagram
TODO: Add architecture diagram illustrating the components and their interactions.
<hr>


## Project Structure
The project structure of the UREP Backend Server is organized as follows:
```src/
├── admin   # Admin Module for managing programmes and viewing statistics
│   ├── admin.controller.ts
│   ├── admin.module.ts
│   ├── admin.service.ts
│   └── dto/
│
├── auth      # Authentication and Authorization Module for admins and users
│   ├── auth.controller.ts
│   ├── auth.module.ts
│   ├── auth.service.ts
│   └── dto/
│
├── nin     # National Identification Number Module for user identity verification. Also fetches basic user info from NIN API
│   ├── nin.controller.ts
│   ├── nin.module.ts
│   ├── nin.service.ts
│   └── dto/
│
├── programme # Programme Module for managing programme data and user registrations
│   ├── programme.controller.ts
│   ├── programme.module.ts
│   ├── programme.service.ts
│   └── dto/
│
├── user   # User Module for managing user profiles and data
│   ├── user.controller.ts
│   ├── user.module.ts
│   ├── user.service.ts
│   └── dto/
│
├── config
│   ├── .env.development.local
│   ├── .env.production.local
│   ├── .env.example
│   └── configuration.ts
│
├── database # Database Module using Drizzle ORM for database interactions
│   ├── drizzle.ts
│   ├── drizzle.module.ts
│   └── migrations/
│
├── strategies
│   ├── jwt.strategy.ts
│   ├── refresh.strategy.ts
│   └── local.strategy.ts
│
├── guards
│   └── roles.guard.ts
│
├── decorators
│   └── roles.decorator.ts
│
├── main.ts
│
└── app.module.ts
```
 **Explanation of Key Directories:**
 - **admin**: Admin module for managing programmes and viewing statistics.
 - **auth**: Authentication and authorization module for admins and users.
 - **nin**: National Identification Number module for user identity verification and fetching basic user info from NIN API.
 - **programme**: Programme module for managing programme data and user registrations.
 - **user**: User module for managing user profiles and data.
 - **config**: Configuration files for environment-specific settings.
 - **database**: Database module using Drizzle ORM for database interactions and migrations.
 - **strategies**: Authentication strategies for JWT, refresh tokens, and local authentication.
 - **guards**: Role-based access control guards.
 - **decorators**: Custom decorators for adding metadata to classes and methods.
 - **main.ts**: Entry point of the application.
 - **app.module.ts**: Root module that imports and configures all other modules.
<hr>

## Getting Started
### Prerequisites
- Node.js (v14 or higher)
- PNPM Package Manager
- PostgreSQL Database
- Docker (optional, for containerization)
- Google Cloud Platform account (for hosting and services)
### Installation
1. Clone the repository:
   ```bash
   git clone
   ```
2. Navigate to the project directory:
   ```bash
   cd urep-backend-server
   ```
3. Install dependencies using PNPM:
   ```bash
   pnpm install
   ```
4. Set up environment variables by creating a `.env` file based on the provided `.env.example` file.
5. Set up the PostgreSQL database and run migrations:
   ```bash
   pnpm run migrate
    ```
6. Start the development server:
   ```bash
   pnpm run start:dev
   ```
7. Access the API documentation at `http://localhost:3000/api`.
8. Make changes and contribute to the project as needed.
9. Push your changes and create a pull request for review.
10. Each feature should have specific branch created from the `develop` branch.
11. Ensure to write tests for new features and run existing tests before pushing changes.
<hr>

## Commit Rules
- Use conventional commit messages (e.g., feat:, fix:, docs:, style:, refactor:, test:, chore:).
- Write clear and concise commit messages.
- Group related changes into a single commit.
- Avoid committing large changes without breaking them down into smaller, manageable commits.
- Ensure that all tests pass before pushing changes.