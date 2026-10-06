const RPNEvaluator = (expression) => {
    const stack = [];

    const handleToken = (token) => {
        if (!isNaN(parseFloat(token))) {
            stack.push(token);
            return;
        }

        const rightToken = parseFloat(stack.pop());
        const leftToken = parseFloat(stack.pop());

        switch (token) {
            case '+':
                stack.push(leftToken + rightToken);
                return;
            case '-':
                stack.push(leftToken - rightToken);
                return;
            case '*':
                stack.push(leftToken * rightToken);
                return;
            case '/':
                stack.push(leftToken / rightToken);
                return;
            case '^':
                stack.push(leftToken ** rightToken);
                return;
            default:
                throw new Error('Invalid token: ${token}');
        }
    };

    for (let element of expression) {
        if (element === ' ') continue;

        handleToken(element);
    }

    return stack.pop();
};

const result = RPNEvaluator('1 2 3 * + 4 -');
console.log(result); // 3