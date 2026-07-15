import { Router, Request, Response } from 'express';
import Marketplace from '../models/Marketplace';
import User from '../models/User';
import { io } from '../server';

const router = Router();

// @route   GET /api/rewards
// @desc    Get all active rewards items
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const rewards = await Marketplace.find({});
    return res.json(rewards);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to retrieve marketplace inventory catalog.' });
  }
});

// @route   POST /api/rewards/redeem
// @desc    Deduct XP from user and deduct stock from inventory
router.post('/redeem', async (req: Request, res: Response): Promise<any> => {
  const { rewardId, userId, userCurrentXp } = req.body;

  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Running simulated redemption fallback.');
      
      // Simulate deduction and return successful transaction
      const remainingXp = userCurrentXp - 1500; // Mock average cost
      
      if (io) {
        io.emit('reward_redeemed_broadcast', {
          userId,
          rewardTitle: 'Redeemed Item (Simulated)',
          cost: 1500
        });
      }

      return res.json({
        message: `Successfully claimed item (Simulated)`,
        cost: 1500,
        remainingXp,
        stockLeft: 10
      });
    }

    const reward = await Marketplace.findById(rewardId);
    if (!reward) {
      return res.status(404).json({ error: 'Reward item not registered.' });
    }

    if (reward.stock <= 0) {
      return res.status(400).json({ error: 'Item out of stock.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User session not found.' });
    }

    if (user.xp < reward.cost) {
      return res.status(400).json({ error: 'Insufficient XP points balance.' });
    }

    // Deduct stock and decrement user XP
    reward.stock -= 1;
    await reward.save();

    user.xp -= reward.cost;
    await user.save();

    if (io) {
      io.emit('reward_redeemed_broadcast', {
        userId: user._id,
        rewardTitle: reward.title,
        cost: reward.cost
      });
    }

    return res.json({
      message: `Successfully claimed ${reward.title}`,
      cost: reward.cost,
      remainingXp: user.xp,
      stockLeft: reward.stock
    });
  } catch (err) {
    console.error('Redeem reward error:', err);
    return res.status(500).json({ error: 'Redemption check failed.' });
  }
});

// @route   POST /api/rewards
// @desc    Add a new reward to the marketplace
router.post('/', async (req: Request, res: Response): Promise<any> => {
  const { title, description, cost, stock, image, category } = req.body;

  try {
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.log('⚠️ MongoDB offline. Simulating reward creation.');
      return res.status(201).json({
        id: `mock-reward-${Math.random().toString(36).substr(2, 9)}`,
        title,
        description,
        cost: Number(cost) || 1000,
        stock: Number(stock) || 10,
        image: image || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
        category: category || 'Hardware'
      });
    }

    const newReward = new Marketplace({
      title,
      description,
      cost: Number(cost) || 1000,
      stock: Number(stock) || 10,
      image: image || 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400',
      category: category || 'Hardware'
    });

    await newReward.save();
    return res.status(201).json(newReward);
  } catch (err) {
    console.error('Create reward error:', err);
    return res.status(500).json({ error: 'Failed to register new reward item.' });
  }
});

export default router;
