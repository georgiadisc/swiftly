import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import db from './db/index.js';
import { cardsTable } from './db/schema/cards.js';
import { usersTable } from './db/schema/users.js';
import payments from './routes/payments.js';
import savings from './routes/savings.js';
import transactions from './routes/transactions.js';
import users from './routes/users.js';
import wallet from './routes/wallet.js';

const app = express();
const port = 3000;

app.use(morgan('tiny'));

app.use(express.json());
app.use(cors());

app.use(payments);
app.use(savings);
app.use(transactions);
app.use(users);
app.use(wallet);

// Starts the Express server and connects to the Redis client.
const server = app.listen(port, async () => {
  const users: (typeof usersTable.$inferInsert)[] = [
    {
      name: 'Craig Turner',
      email: 'craig.turner@example.com',
      tag: '$craig.turner',
      address: '292 Cook Hill Road Trumbull, CT 06611',
      phone: '2098195553',
      balance: '75.50',
      savings: '150.30',
      stocks: '825.45',
      bitcoin: '350.75',
    },
    {
      name: 'Susan Allen',
      email: 'susan.allen@example.com',
      tag: '$susan.allen',
      address: '922 Richards Avenue Modesto, CA 95354',
      phone: '8049180272',
      balance: '200.00',
      savings: '350.75',
      stocks: '123.60',
      bitcoin: '124.90',
    },
  ];
  await db.insert(usersTable).values(users).onConflictDoNothing();
  const cards: (typeof cardsTable.$inferInsert)[] = [
    {
      userId: 1,
      cardType: 'Visa',
      lastFourDigits: '1234',
      expirationDate: '2027-04-18',
    },
    {
      userId: 2,
      cardType: 'Mastercard',
      lastFourDigits: '5678',
      expirationDate: '2028-01-09',
    },
  ];
  await db.insert(cardsTable).values(cards).onConflictDoNothing();
  console.debug(`Server is running on http://localhost:${port}`);
});

// Handles termination signals to gracefully shut down the server and Redis connection.
process.on('SIGTERM', () => {
  console.debug('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.debug('HTTP server closed');
  });
});
