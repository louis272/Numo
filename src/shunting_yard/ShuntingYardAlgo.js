// Operator precedence table
const operators = {
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

// Assert function
const assert = (predicate) => {
    if (predicate) return;
    throw new Error(`Assertion failed for predicate: ${predicate}`);
};

// Shunting Yard algorithm implementation
// Converts infix notation and evaluates it at the same time
const evaluate = (expression) => {
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
            
            case Object.keys(operators).includes(token):
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
                break;

            default:
                throw new Error(`Invalid token: ${token}`);
        }
    };

    for (let element of expression) {
        if (element === ' ') continue;

        handleToken(element);
    }

    while (opStack.length > 0) {
        assert(seeTop() !== '(');  // Mismatched parentheses
        addToResult(handlePop());
    }

    return result[0];
};

// Shunting Yard algorithm implementation
// Converts infix notation to RPN/postfix notation
const toRPN = (expression) => {
    const opStack = [];
    let rpn = '';

    // Return the operator on top of the stack of operators
    const seeTop = () => {
        return opStack.at(-1);
    };

    const addToRpn = (token) => {
        rpn += ' ' + token
    };

    const handlePop = () => {
        return opStack.pop();
    };

    const handleToken = (token) => {
        switch (true) {
            case !isNaN(parseFloat(token)):
                addToRpn(token);
                break;
            
            case Object.keys(operators).includes(token):
                const op1 = token;
                let op2 = seeTop();

                while (
                    op2 !== undefined && op2 !== '(' && 
                    (operators[op2].prec > operators[op1].prec || 
                        (operators[op2].prec === operators[op1].prec && operators[op1].assoc === 'left'))
                ) {
                    addToRpn(handlePop());  // Pop and add op2
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
                    addToRpn(handlePop());
                    topOp = seeTop();
                }

                assert(seeTop() === '(');
                handlePop();
                break;

            default:
                throw new Error(`Invalid token: ${token}`);
        }
    };

    for (let element of expression) {
        if (element === ' ') continue;

        handleToken(element);
    }

    while (opStack.length > 0) {
        assert(seeTop() !== '(');  // Mismatched parentheses
        addToRpn(handlePop());
    }

    return rpn;
};

const input = '1 + 2 * 3 - 4'
const resultRpn = toRPN(input);
const result = evaluate(input);
console.log(resultRpn); // 1 2 3 * + 4 -
console.log(result);