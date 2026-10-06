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
    throw new Error('Assertion failed for predicate: ${predicate}');
};

// Shunting Yard algorithm implementation
const toRPN = (expression) => {
    const opStack = [];
    let rpn = '';

    // Return the operator on top of the stack of operators
    const seeTop = () => {
        return opStack.at(-1);
    };

    const handlePop = () => {
        return opStack.pop();
    };

    const handleToken = (token) => {
        switch (true) {
            case !isNaN(parseFloat(token)):
                rpn += ' ' + token;
                break;
            
            case Object.keys(operators).includes(token):
                const op1 = token;
                let op2 = seeTop();

                while (
                    op2 !== undefined && op2 !== '(' && 
                    (operators[op2].prec > operators[op1].prec || 
                        (operators[op2].prec === operators[op1].prec && operators[op1].assoc === 'left'))
                ) {
                    rpn += ' ' + handlePop();  // Pop and add op2
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
                    rpn += ' ' + handlePop();
                    topOp = seeTop();
                }

                assert(seeTop() === '(');
                handlePop();
                break;

            default:
                throw new Error('Invalid token: ${token}');
        }
    };

    for (let element of expression) {
        if (element === ' ') continue;

        handleToken(element);
    }

    while (opStack.length > 0) {
        assert(seeTop() !== '(');  // Mismatched parentheses
        rpn += ' ' + handlePop();
    }

    return rpn;
};

const input = '1 + 2 * 3 - 4'
const result = toRPN(input);
console.log(result); // 1 2 3 * + 4 -