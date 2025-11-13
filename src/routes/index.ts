import { Router } from 'express';

const router = Router();

// Define your routes here
router.get('/example', (req, res) => {
  res.json({ message: 'This is an example route' });
});

export default router;