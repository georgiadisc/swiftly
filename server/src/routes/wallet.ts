import { eq, sql } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from 'express';
import db from '../db/index.js';
import { cardsTable } from '../db/schema/cards.js';
import { transactionsTable } from '../db/schema/transactions.js';
import { usersTable } from '../db/schema/users.js';

const router = express.Router();

router.get('/wallet', readWallet);
router.get('/wallet/cards', readCards);
router.post('/wallet/cash/deposit', createCashDeposit);
router.post('/wallet/cash/withdraw', createCashWithdrawal);

async function readWallet(req: Request, res: Response): Promise<any> {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [wallet] = await db
      .select({
        balance: usersTable.balance,
        savings: usersTable.savings,
        stocks: usersTable.stocks,
        bitcoin: usersTable.bitcoin,
      })
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)));

    if (!wallet) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ data: wallet });
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving wallet data' });
  }
}

async function readCards(req: Request, res: Response): Promise<any> {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const creditCards = await db
      .select()
      .from(cardsTable)
      .where(eq(cardsTable.userId, Number(userId)));

    if (creditCards.length === 0) {
      return res.status(404).json({ error: 'No credit cards found for this user' });
    }

    res.status(200).json({ data: creditCards });
  } catch (error) {
    console.error('Error fetching credit card data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving credit card data' });
  }
}

async function createCashDeposit(req: Request, res: Response): Promise<any> {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid user ID or amount' });
  }

  try {
    // Start a transaction
    await db.transaction(async (tx) => {
      // Update the user's balance within the transaction
      await tx
        .update(usersTable)
        .set({
          balance: sql`${usersTable.balance} + ${amount}`,
        })
        .where(eq(usersTable.id, userId));

      // Fetch the updated balance within the transaction
      const updatedUser = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      // Log the cash deposit in the transactions table
      await tx.insert(transactionsTable).values({
        userId,
        type: 'cash_in',
        amount,
        balanceAfter: updatedUser[0].balance,
        description: 'Deposit to cash',
      });

      res.status(200).json({
        message: 'Deposit successful',
        newBalance: updatedUser[0].balance,
      });
    });
  } catch (error) {
    console.error('Error during deposit transaction:', error);
    res.status(500).json({ error: 'An error occurred while processing the deposit' });
  }
}

async function createCashWithdrawal(req: Request, res: Response): Promise<any> {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid user ID or amount' });
  }

  try {
    // Start a transaction
    await db.transaction(async (tx) => {
      // Fetch the user's current balance within the transaction
      const user = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      if (!user[0]) {
        return res.status(404).json({ error: 'User not found' });
      }

      const currentBalance = user[0].balance;

      // Ensure sufficient funds
      if (currentBalance < amount) {
        tx.rollback();
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      // Deduct the amount from the user's balance within the transaction
      await tx
        .update(usersTable)
        .set({
          balance: sql`${usersTable.balance} - ${amount}`,
        })
        .where(eq(usersTable.id, userId));

      // Fetch the updated balance within the transaction
      const updatedUser = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.id, userId));

      // Log the withdrawal in the transactions table
      await tx.insert(transactionsTable).values({
        userId,
        type: 'cash_out',
        amount,
        balanceAfter: updatedUser[0].balance,
        description: 'Withdraw from cash',
      });

      res.status(200).json({
        message: 'Withdrawal successful',
        newBalance: updatedUser[0].balance,
      });
    });
  } catch (error) {
    console.error('Error during withdrawal transaction:', error);
    res.status(500).json({ error: 'An error occurred while processing the withdrawal' });
  }
}

export default router;
