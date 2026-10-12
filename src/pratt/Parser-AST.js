const { TokenTypes, Tokenizer } = require('./Tokenizer');

class Parser {
    parse (expression) {
        this.expr = expression;
        this.tokenizer = new Tokenizer(expression);
        this.lookahead = this.tokenizer.getNextToken();
        this.operators = {
            '^': 5,
            unary: 4,
            '*': 3,
            '/': 3,
            '+': 2,
            '-': 2
        }

        return this.Expression()
    }

    // Expect a particular token, consume it, and move to the next one
    eat(tokenType) {
        const token = this.lookahead

        if (token == null) {
            throw new SyntaxError(`Unexpected end of expression, expected "${tokenType}"`);
        }

        if (token.type !== tokenType) {
            throw new SyntaxError(`Unexpected token: "${token.value}", expected "${tokenType}"`);
        }

        // Advance to next token
        this.lookahead = this.tokenizer.getNextToken();

        return token;
    }

    getPrecedence(token) {
        if (token === 'unary') {
            return this.operators.unary;
        }

        if (token?.type) {
            return this.operators[token.value];
        }

        return 0;
    }

    /**
     * Expression
     *   = Prefix (Infix)*
     */
    Expression(prec=0) {
        let left = this.Prefix()

        while (prec < this.getPrecedence(this.lookahead)) {
            left = this.Infix(left, this.lookahead?.type);
        }

        return left;
    }

    /**
     * Prefix
     *   = ParenthesizedExpression
     *   / UnaryExpression
     *   / FunctionExpression
     *   / NUMBER
     */
    Prefix() {
        if (this.lookahead.type === TokenTypes.PARENTHESIS_LEFT) {
            return this.ParenthesizedExpression();
        }

        if (this.lookahead.type === TokenTypes.SUBTRACTION) {
            return this.UnaryExpression();
        }

        if (this.lookahead.type === TokenTypes.IDENTIFIER) {
            return this.FunctionExpression();
        }

        const token = this.eat(TokenTypes.NUMBER);
        return {
            type: 'Number',
            value: Number(token.value)
        };
    }

    /**
     * Infix
     *   = ("+" / "-" / "*" / "/" / "^") Expression
     */
    Infix(left, operatorType) {
        let token = this.eat(operatorType);
        let newPrec = this.operators[token.value];

        return {
            type: 'BinaryExpression',
            operator: token.value,
            left,
            right: this.Expression(
                token.type === TokenTypes.EXPONENTIATION ? newPrec - 1 : newPrec
            )
        };
    }

    /**
     * ParenthesizedExpression
     *   = "(" Expression ")"
     */
    ParenthesizedExpression() {
        this.eat(TokenTypes.PARENTHESIS_LEFT);
        const expr = this.Expression();
        this.eat(TokenTypes.PARENTHESIS_RIGHT);
        return expr;
    }

    /**
     * UnaryExpression
     *   = "-" Expression
     */
    UnaryExpression() {
        this.eat(TokenTypes.SUBTRACTION);
        return {
            type: 'UnaryExpression',
            value: this.Expression(this.getPrecedence('unary'))
        };
    }

    /**
     * FunctionExpression
     *   = FUNC_ID ParenthesizedExpression
     */
    FunctionExpression() {
        const func_id = this.eat(TokenTypes.IDENTIFIER).value;
        const expr = this.ParenthesizedExpression();
        return {
            type: 'Function',
            name: func_id,
            value: expr
        };
    }
}


// Export
module.exports = { Parser }