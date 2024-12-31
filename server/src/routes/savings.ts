import type { Request, Response } from 'express';
import express from 'express';
import db from '../db/index.js';
import { usersTable } from '../db/schema/users.js';
import { eq, sql } from 'drizzle-orm';
import { transactionsTable } from '../db/schema/transactions.js';
import { Decimal } from 'decimal.js';

const router = express.Router();

router.get('/savings', getSavings);
router.post('/savings/deposit', createSavingsDeposit);
router.post('/savings/withdraw', createWithdrawal);

async function getSavings(req: Request, res: Response): Promise<any> {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [user] = await db
      .select({ savings: usersTable.savings })
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ data: { balance: user.savings } });
  } catch (error) {
    console.error('Error fetching savings data:', error);
    res.status(500).json({ error: 'An error occurred while retrieving savings balance' });
  }
}

async function createSavingsDeposit(req: Request, res: Response): Promise<any> {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid user ID or amount' });
  }

  try {
    await db.transaction(async (tx) => {
      const [user] = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.id, Number(userId)));

      if (!user) {
        tx.rollback();
        return res.status(404).json({ error: 'User not found' });
      }

      const userBalance = new Decimal(user.balance);
      const depositAmount = new Decimal(amount);

      if (userBalance.lessThan(depositAmount)) {
        tx.rollback();
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      await tx
        .update(usersTable)
        .set({
          savings: sql`${usersTable.savings} + ${amount}`,
          balance: sql`${usersTable.balance} - ${amount}`,
        })
        .where(eq(usersTable.id, Number(userId)));

      const [updatedUser] = await tx
        .select({ savings: usersTable.savings })
        .from(usersTable)
        .where(eq(usersTable.id, Number(userId)));

      // Log the deposit in the transactions table
      await tx.insert(transactionsTable).values({
        userId,
        type: 'savings_in',
        amount,
        balanceAfter: updatedUser.savings,
        description: 'Deposit to savings',
      });

      res
        .status(200)
        .json({ message: 'Savings deposit successful', newBalance: updatedUser.savings });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during savings deposit' });
  }
}

async function createWithdrawal(req: Request, res: Response): Promise<any> {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ error: 'Invalid user ID or amount' });
  }

  try {
    await db.transaction(async (tx) => {
      const [user] = await tx
        .select({ savings: usersTable.savings })
        .from(usersTable)
        .where(eq(usersTable.id, Number(userId)));

      if (!user) {
        tx.rollback();
        return res.status(404).json({ error: 'User not found' });
      }

      const userSavings = new Decimal(user.savings);
      const withdrawalAmount = new Decimal(amount);

      if (userSavings.lessThan(withdrawalAmount)) {
        tx.rollback();
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      await tx
        .update(usersTable)
        .set({
          savings: sql`${usersTable.savings} - ${amount}`,
          balance: sql`${usersTable.balance} + ${amount}`,
        })
        .where(eq(usersTable.id, Number(userId)));

      const [updatedUser] = await tx
        .select({ savings: usersTable.savings })
        .from(usersTable)
        .where(eq(usersTable.id, Number(userId)));

      // Log the withdrawal in the transactions table
      await tx.insert(transactionsTable).values({
        userId,
        type: 'savings_out',
        amount,
        balanceAfter: updatedUser.savings,
        description: 'Withdraw from savings',
      });

      res
        .status(200)
        .json({ message: 'Savings withdrawal successful', newBalance: updatedUser.savings });
    });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred during savings withdrawal' });
  }
}

export default router;
