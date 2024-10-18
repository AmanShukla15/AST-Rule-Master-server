import { evaluateRule as evaluteRuleFunc } from "../utils/ruleEvaluator.js";

const evaluateRule = async (req, res) => {
    const { rule, data } = req.body;
    try {
        const result = evaluteRuleFunc(rule, data);
        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: "Invalid rule" });
    }
};

export {
    evaluateRule
};
