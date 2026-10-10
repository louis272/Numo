// Imports
const Tokenizer = require('./Tokenizer');

// Operator precedence table
const operators = {
    'u': {
        prec: 4,
        assoc: 'right',
    },
    '^': {
        prec: 4,
        assoc: 'right',
    },
    '*': {
        prec: 3,
        assoc: 'left',
    },
    '/': {
        prec: 3,
        assoc: 'left',
    },
    '+': {
        prec: 2,
        assoc: 'left',
    },
    '-': {
        prec: 2,
        assoc: 'left',
    },
};

// List of supported function names
const functionList = ['sin', 'cos', 'tan'];

// Is the token a valid function
const isFunction = (token) => {
    return functionList.includes(token.toLowerCase());
}

// Assert function
const assert = (predicate) => {
    if (predicate) return;
    throw new Error(`Assertion failed for predicate: ${predicate}`);
};

// Main evaluation function
const evaluate = (expression) => {
    const opSymbols = Object.keys(operators);
    const opStack = [];
    let result = [];

    // Return the operator on top of the stack of operators
    const seeTop = () => {
        return opStack.at(-1);
    };

    const addToResult = (token) => {
        result.push(token);
    };

    const handlePop = () => {
        const op = opStack.pop();
        
        if (op === '(') return;

        if (op === 'u') return -parseFloat(result.pop());

        if (isFunction(op)) {
            const topValue = result.pop();
            switch (op) {
                case 'sin':
                    return Math.sin(topValue);
                case 'cos':
                    return Math.cos(topValue);
                case 'tan':
                    return Math.tan(topValue);
            }
        }

        const rightToken = parseFloat(result.pop());
        const leftToken = parseFloat(result.pop());

        switch (op) {
            case '+':
                return leftToken + rightToken;
            case '-':
                return leftToken - rightToken;
            case '*':
                return leftToken * rightToken;
            case '/':
                return leftToken / rightToken;
            case '^':
                return leftToken ** rightToken;
            default:
                throw new Error(`Invalid operation: ${op}`);
        }
    };

    const handleToken = (token) => {
        switch (true) {
            case !isNaN(parseFloat(token)):
                addToResult(token);
                break;

            case isFunction(token):
                opStack.push(token);
                break;
            
            case opSymbols.includes(token):
                const op1 = token;
                let op2 = seeTop();

                while (
                    op2 !== undefined && op2 !== '(' && 
                    (operators[op2].prec > operators[op1].prec || 
                        (operators[op2].prec === operators[op1].prec && operators[op1].assoc === 'left'))
                ) {
                    addToResult(handlePop());  // Pop and add op2
                    op2 = seeTop();
                }

                opStack.push(op1);
                break;
            
            case token === '(':
                opStack.push(token);
                break;
        
            case token === ')':
                let topOp = seeTop();
                while (topOp !== '(') {
                    assert(opStack.length !== 0);
                    addToResult(handlePop());
                    topOp = seeTop();
                }

                assert(seeTop() === '(');
                handlePop();
                topOfStack = seeTop();
                if (topOfStack && isFunction(topOfStack)) {
                    addToResult(handlePop());
                }
                break;

            default:
                throw new Error(`Invalid token: ${token}`);
        }
    };

    const tokenizer = new Tokenizer(expression);
    let token;
    let prevToken = null;
    while ((token = tokenizer.getNextToken())) {
        if (
            token.value === '-' &&
            (prevToken === null || 
                prevToken.value === '(' || 
                opSymbols.includes(prevToken.value))
        ) {
            handleToken('u');  // Use a "virtual" unary token
        } else {
            handleToken(token.value);
        }
        prevToken = token;
    }

    while (opStack.length > 0) {
        assert(seeTop() !== '(');  // Mismatched parentheses
        addToResult(handlePop());
    }

    return result[0];
};


const input1 = '-1';
const input2 = '(-1)';
const input3 = '1 + -2';
const input4 = '1 - -2';
const input5 = '-2 ^ 2';
const input6 = '(-2) ^ 2';

console.log(evaluate(input1)); // -1
console.log(evaluate(input2)); // -1
console.log(evaluate(input3)); // -1
console.log(evaluate(input4)); // 3
console.log(evaluate(input5)); // -4
console.log(evaluate(input6)); // 4