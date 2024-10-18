import express from 'express';
import { evaluateRule } from '../controller/ruleController.js';
import Rule from '../models/Rule.js';

const router = express.Router();

router.post('/evaluate-rule', evaluateRule);

router.get('/', async (req, res) => {
    try {
        const rules = await Rule.find();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ message: 'Server error while retrieving rules.' });
    }
});

export default router;
