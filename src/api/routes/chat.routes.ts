import { Router } from 'express';

const router = Router();

router.post('/', (req, res) => {
  res.json({ message: 'Chat message received' });
});

export default router;