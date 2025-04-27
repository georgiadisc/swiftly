![Logo](docs/logo.svg)

***

A modern three-tier digital payments application inspired by Cash App and Venmo. Built with **React** for the frontend, **PostgreSQL** for the database, and featuring backend implementations in both **Node.js/Express/TypeScript** and **Java/Spring Boot**.

## 🌟 Features

- Instant money transfers between users
- Digital wallet management
- Savings account functionality
- Card management system
- Transaction history tracking
- User-friendly interface inspired by modern fintech apps

## 📸 Screenshots

![Activity page of Swiftly](docs/activity.webp)

## 📁 Project Structure

```
├── client/
│   ├── app/
│   │   ├── routes/
│   │   ├── root.tsx
│   │   ├── entry.client.tsx
│   │   └── entry.server.tsx
│   └── public/
├── server/                # Node.js/Express/TypeScript backend
│   ├── routes/
│   ├── db/
│   │   └── schema/
│   └── index.ts
├── spring-server/         # Java/Spring Boot backend
│   └── src/
│       └── main/
│           └── java/
│               └── com/
│                   └── swiftly/
│                       └── server/
│                           ├── controller/
│                           ├── service/
│                           ├── entity/
│                           ├── repository/
│                           └── ...
└── infra/
```

## 🚀 Getting Started

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/swiftly.git
cd swiftly
```

2. Start the application using Docker Compose:

```bash
docker-compose up
```

The application should now be running at `http://localhost:3000`

To stop the application:

```bash
docker-compose down
```

## 🔄 API Endpoints

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/payments` | POST | Create new payment |
| `/savings` | GET | Get savings information |
| `/savings/deposit` | POST | Make a deposit to savings |
| `/savings/withdraw` | POST | Withdraw from savings |
| `/transactions` | GET | Get transaction history |
| `/users` | GET | Get user information |
| `/wallet` | GET | Get wallet information |
| `/wallet/cards` | GET | Get cards list |
| `/wallet/cash/deposit` | POST | Deposit cash |
| `/wallet/cash/withdraw` | POST | Withdraw cash |

> **Note:** Both Node.js/Express and Spring Boot backends implement similar REST APIs. You can choose which backend to run based on your preference or integration needs.

## 💾 Database Schema

The application uses four main tables:

- `users`: Stores user information and balances
- `cards`: Manages linked payment cards
- `payments`: Records user-to-user payments
- `transactions`: Tracks all financial transactions

## 🛠️ Built With

- [TypeScript](https://www.typescriptlang.org/)
- [React](https://reactjs.org/)
- [Remix](https://remix.run/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Java](https://www.java.com/)
- [Spring Boot](https://spring.io/projects/spring-boot)
- [PostgreSQL](https://www.postgresql.org/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Docker](https://www.docker.com/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
