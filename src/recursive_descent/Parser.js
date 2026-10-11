const { TokenTypes, Tokenizer } = require('./Tokenizer');

class Parser {
    parse (expression) {
        this.expr = expression;
        this.tokenizer = new Tokenizer(expression);
        this.lookahead = this.tokenizer.getNextToken();

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

    trig(id, value) {
        switch (id) {
            case 'sin':
                return Math.sin(value)
            case 'cos':
                return Math.cos(value)
            case 'tan':
                return Math.tan(value)
            default:
                throw new Error(`Invalid operation: ${id}`)
        }
    }

    BinaryExpression(leftRule, rightRule, operatorType1, operatorType2) {
        let left = leftRule();

        while (
            this.lookahead &&
            (this.lookahead.type === operatorType1 ||
                this.lookahead.type === operatorType2
            )
        ) {
            const operator = this.eat(this.lookahead.type).type
            switch (operator) {
                case TokenTypes.ADDITION:
                    left = left + rightRule();
                    break;
                case TokenTypes.SUBTRACTION:
                    left = left - rightRule();
                    break;
                case TokenTypes.MULTIPLICATION:
                    left = left * rightRule();
                    break;
                case TokenTypes.DIVISION:
                    left = left / rightRule();
                    break;
                case TokenTypes.EXPONENTIATION:
                    left = left ** rightRule();
                    break;
            }
        }

        return left;
    }

    /**
     * Expression
     *   = Term (("+" / "-") Term)*
     */
    Expression() {
        return this.BinaryExpression(
            () => this.Term(),
            () => this.Term(),
            TokenTypes.ADDITION,
            TokenTypes.SUBTRACTION
        )
    }

    /**
     * Term
     *   = Factor (("*" / "/") Factor)*
     */
    Term() {
        return this.BinaryExpression(
            () => this.Factor(),
            () => this.Factor(),
            TokenTypes.MULTIPLICATION,
            TokenTypes.DIVISION
        )
    }

    /**
     * Factor
     *   = Primary ("^" Factor)*
     */
    Factor() {
        return this.BinaryExpression(
            () => this.Primary(),
            () => this.Factor(),
            TokenTypes.EXPONENTIATION
        )
    }

    /**
     * Primary
     *   = ParenthesizedExpression
     *   / UnaryExpression
     *   / FunctionExpression
     *   / NUMBER
     */
    Primary() {
        if (this.lookahead == null) {
            throw new SyntaxError('Unexpected end of expression');
        }

        if (this.lookahead.type === TokenTypes.PARENTHESIS_LEFT) {
            return this.ParenthesizedExpression();
        }

        if (this.lookahead.type == TokenTypes.SUBTRACTION) {
            return this.UnaryExpression();
        }

        if (this.lookahead.type === TokenTypes.IDENTIFIER) {
            return this.FunctionExpression();
        }

        const token = this.eat(TokenTypes.NUMBER);
        return Number(token.value);
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
     *   = "-" Factor
     */
    UnaryExpression() {
        this.eat(TokenTypes.SUBTRACTION);
        return -this.Factor();
    }

    /**
     * FunctionExpression
     *   = IDENTIFIER ParenthesizedExpression
     */
    FunctionExpression() {
        const func_id = this.eat(TokenTypes.IDENTIFIER).value;
        return this.trig(func_id, this.ParenthesizedExpression());
    }
}


// Export
module.exports = { Parser }

// CLI
if (require.main === module) {
    const input = process.argv[2] ?? '';
    const parser = new Parser();
    console.log(parser.parse(input));
}