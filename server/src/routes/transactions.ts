import { eq, desc } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from 'express';
import db from '../db/index.js';
import { transactionsTable } from '../db/schema/transactions.js';

const router = express.Router();

router.get('/transactions', getTransactions);

async function getTransactions(req: Request, res: Response): Promise<any> {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const transactions = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, Number(userId)))
      .orderBy(desc(transactionsTable.timestamp));

    res.status(200).json({ data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to retrieve transactions' });
  }
}

export default router;
