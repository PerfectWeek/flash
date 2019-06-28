import { Router } from 'express';

const router = Router();

// Auth routes
router.use('/auth', (req, res) => { res.send('Coming soon'); });

// Rooms routes
router.use('/rooms', (req, res) => { res.send('Coming soon'); });

export default router;
