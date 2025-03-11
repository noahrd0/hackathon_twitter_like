import express from 'express';
import {
    registerUser,
    loginUser,
    updateUser,
    getUser,
    deleteUser,
    followUser
} from '../controllers/UserController.js';
import { authMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/update/:id', authMiddleware, updateUser);
router.get('/:id', authMiddleware, getUser);
router.get('/', authMiddleware, getUser);
router.delete('/:id', authMiddleware, deleteUser);
router.put('/follow/:id', authMiddleware, followUser);

export default router;