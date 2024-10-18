import Rule from "../models/Rule.js";

class ASTNode {
    constructor(type, value = null) {
        this.type = type; 
        this.value = value; 
        this.left = null; 
        this.right = null;
    }
}


export function parseRuleToAST(ruleString) {

    const tokens = ruleString.match(/(?:[^\s]+|'[^']*')/g); 
    const operatorPrecedence = { 'AND': 1, 'OR': 0 };
    const operatorStack = [];
    const nodeStack = [];

    const createNode = (operator) => {
        const rightNode = nodeStack.pop();
        const leftNode = nodeStack.pop();
        const operatorNode = new ASTNode('operator', operator);
        operatorNode.left = leftNode;
        operatorNode.right = rightNode;
        nodeStack.push(operatorNode);
    };

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        if (['AND', 'OR'].includes(token)) {
            while (operatorStack.length && operatorPrecedence[operatorStack[operatorStack.length - 1]] >= operatorPrecedence[token]) {
                createNode(operatorStack.pop());
            }
            operatorStack.push(token);
        } else {
            // Create a condition node (like 'age > 12' or 'department = \'Sales\'')
            const condition = `${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`;
            i += 2; // Skip the next two tokens as they are part of the condition
            nodeStack.push(new ASTNode('condition', condition));
        }
    }

    while (operatorStack.length) {
        createNode(operatorStack.pop());
    }
    // Storing ruleString in DB
    Rule.findOne({ ruleString: ruleString })
    .then(ruleStringExist => {

        if (!ruleStringExist) {
            Rule.create({ ruleString })
                .then(() => {
                    console.log("Rule created successfully.");
                })
                .catch(error => {
                    console.error("Error creating rule:", error);
                });
        }})
        .catch(error => {
            console.error("Error finding rule:", error);
        });
    
    return nodeStack[0]; // Return the root of the AST
}

// Function to evaluate AST
export function evaluateAST(node, data) {
    if (node.type === 'condition') {
        return evaluateCondition(node.value, data);
    }

    const leftResult = evaluateAST(node.left, data);
    const rightResult = evaluateAST(node.right, data);

    if (node.value === 'AND') {
        return leftResult && rightResult;
    } else if (node.value === 'OR') {
        return leftResult || rightResult;
    }

    return false;
}

// Updated evaluateCondition to handle numeric fields and strings
export function evaluateCondition(condition, data) {
    const parts = condition.match(/([a-zA-Z]+)\s*(=|>|<|>=|<=)\s*('.*?'|\d+)/); 
    if (!parts) return false; // If the condition is not properly parsed
    const [_, field, operator, value] = parts;
    const dataValue = data[field];

    if (dataValue === undefined) {
        console.error(`Field "${field}" not found in data.`);
        return false;
    }

    const isNumericField = !isNaN(dataValue) && !isNaN(value);

    switch (operator) {
        case '>':
            return isNumericField ? Number(dataValue) > Number(value) : dataValue > value;
        case '<':
            return isNumericField ? Number(dataValue) < Number(value) : dataValue < value;
        case '=':
            return isNumericField ? Number(dataValue) === Number(value) : dataValue === value.replace(/'/g, '');
        case '>=':
            return isNumericField ? Number(dataValue) >= Number(value) : dataValue >= value;
        case '<=':
            return isNumericField ? Number(dataValue) <= Number(value) : dataValue <= value;
        default:
            console.error(`Unknown operator "${operator}"`);
            return false;
    }
}

// Main function to evaluate rule
export function evaluateRule(ruleString, data) {
    // Parse the rule into an AST
    const ast = parseRuleToAST(ruleString);

    // Evaluate the AST based on the provided data
    const result = evaluateAST(ast, data);
    
    return result;
}

