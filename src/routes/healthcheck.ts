import { Router } from 'express';
import prisma from '../../prisma/client';

const router = Router();

router.get('/', async (request, response) => {
  const count = await prisma.account.count(); // check db is up
  console.log("Healthcheck: " + count)
  response.send("OK")
});

export default router;
