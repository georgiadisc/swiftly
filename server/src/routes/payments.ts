import { Decimal } from 'decimal.js';
import { eq, sql } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from 'express';
import db from '../db/index.js';
import { paymentsTable } from '../db/schema/payments.js';
import { usersTable } from '../db/schema/users.js';
import { transactionsTable } from '../db/schema/transactions.js';

const router = express.Router();

router.post('/payments', createPayment);

async function createPayment(req: Request, res: Response): Promise<any> {
  const { action, senderUserTag, receiverUserTag, note, amount } = req.body;

  if (!action || !senderUserTag || !receiverUserTag || !note || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (senderUserTag === receiverUserTag) {
    return res
      .status(400)
      .json({ error: "Invalid 'action'. Sender and receiver should not match." });
  }

  if (!['pay', 'charge'].includes(action)) {
    return res.status(400).json({ error: "Invalid 'action' value. Must be 'pay' or 'charge'." });
  }

  const sender = await db.select().from(usersTable).where(eq(usersTable.tag, senderUserTag));
  const receiver = await db.select().from(usersTable).where(eq(usersTable.tag, receiverUserTag));

  if (!sender[0]) {
    return res.status(404).json({ error: 'Sender not found' });
  }

  if (!receiver[0]) {
    return res.status(404).json({ error: 'Receiver not found' });
  }

  const paymentAmount = new Decimal(amount);

  try {
    await db.transaction(async (tx) => {
      const debitUserTag = action === 'pay' ? senderUserTag : receiverUserTag;
      const creditUserTag = action === 'pay' ? receiverUserTag : senderUserTag;

      const [debitAccount] = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.tag, debitUserTag));

      const debitUserBalance = new Decimal(debitAccount.balance);

      if (!debitAccount || debitUserBalance.lessThan(paymentAmount)) {
        tx.rollback();
        return res.status(400).json({ error: 'Insufficient funds' });
      }

      const [newPayment] = await tx
        .insert(paymentsTable)
        .values({
          senderUserTag,
          receiverUserTag,
          note,
          amount,
        })
        .returning();

      // Debit sender's wallet balance
      await tx
        .update(usersTable)
        .set({ balance: sql`${usersTable.balance} - ${amount}` })
        .where(eq(usersTable.tag, debitUserTag));

      // Credit receiver's wallet balance
      await tx
        .update(usersTable)
        .set({ balance: sql`${usersTable.balance} + ${amount}` })
        .where(eq(usersTable.tag, creditUserTag));

      const [updatedDebitAccount] = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.tag, debitUserTag));

      const [updatedCreditAccount] = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.tag, creditUserTag));

      await tx.insert(transactionsTable).values([
        {
          userId: sender[0].id,
          type: action === 'pay' ? 'transfer_out' : 'transfer_in',
          amount,
          balanceAfter:
            action === 'pay' ? updatedDebitAccount.balance : updatedCreditAccount.balance,
          targetUserId: receiver[0].id,
          description: action === 'pay' ? 'Transfer to another user' : 'Charge another user',
        },
        {
          userId: receiver[0].id,
          type: action === 'pay' ? 'transfer_in' : 'transfer_out',
          amount,
          balanceAfter:
            action === 'pay' ? updatedCreditAccount.balance : updatedDebitAccount.balance,
          targetUserId: sender[0].id,
          description:
            action === 'pay' ? 'Received transfer from another user' : 'Charged by another user',
        },
      ]);

      const [updatedSenderAccount] = await tx
        .select({ balance: usersTable.balance })
        .from(usersTable)
        .where(eq(usersTable.tag, senderUserTag));

      res.status(201).json({
        data: {
          balance: updatedSenderAccount.balance,
          payment: newPayment,
        },
      });
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'An error occurred while creating the payment' });
  }
}

export default router;
