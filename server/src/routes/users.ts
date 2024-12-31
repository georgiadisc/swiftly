import { eq } from 'drizzle-orm';
import type { Request, Response } from 'express';
import express from 'express';
import db from '../db/index.js';
import { usersTable } from '../db/schema/users.js';

const router = express.Router();

router.get('/users', getUser);

async function getUser(req: Request, res: Response): Promise<any> {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const [user] = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        tag: usersTable.tag,
        address: usersTable.address,
        email: usersTable.email,
        phone: usersTable.phone,
      })
      .from(usersTable)
      .where(eq(usersTable.id, Number(userId)));

    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
}

export default router;
