// Token types table
const TokenTypes = {
    NUMBER: 'NUMBER',
    IDENTIFIER: 'IDENTIFIER',
    ADDITION: '+',
    SUBTRACTION: '-',
    MULTIPLICATION: '*',
    DIVISION: '/',
    EXPONENTIATION: '^',
    PARENTHESIS_LEFT: '(',
    PARENTHESIS_RIGHT: ')',
}

// Token specification 
// Regex - TokenType correspondance array
const TokenSpec = [
    [/^\s+/, null],
    [/^(?:\d+(?:\.\d*)?|\.\d+)/, TokenTypes.NUMBER],
    [/^[a-z]+/, TokenTypes.IDENTIFIER],
    [/^\+/, TokenTypes.ADDITION],
    [/^\-/, TokenTypes.SUBTRACTION],
    [/^\*/, TokenTypes.MULTIPLICATION],
    [/^\//, TokenTypes.DIVISION],
    [/^\^/, TokenTypes.EXPONENTIATION],
    [/^\(/, TokenTypes.PARENTHESIS_LEFT],
    [/^\)/, TokenTypes.PARENTHESIS_RIGHT],
]

// Tokenizer class
class Tokenizer {
    constructor (expression) {
        this.expression = expression;
        this.cursor = 0;
    }

    hasMoreTokens() {
        return this.cursor < this.expression.length;
    }

    match(regex, exprSlice) {
        const matched = regex.exec(exprSlice);
        if (matched === null) return null;

        this.cursor += matched[0].length;
        return matched[0];
    }

    getNextToken() {
        if (!this.hasMoreTokens()) return null;

        const exprSlice = this.expression.slice(this.cursor);

        for (const [regex, type] of TokenSpec) {
            const tokenValue = this.match(regex, exprSlice);

            if (tokenValue === null) continue;  // No rule matched

            if (type === null) return this.getNextToken();  // Skip whitespace

            return {type, value: tokenValue,};
        }

        throw new SyntaxError(`Unexpected token: "${exprSlice[0]}"`);
    }
}

// Exports
module.exports = {
    TokenTypes,
    Tokenizer
}