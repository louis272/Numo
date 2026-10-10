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

// Export the class
module.exports = Tokenizer;


// Basic tokenizer function
// const tokenizer = (expression) => {
//     let buffer = '';
//     const tokens = [];

//     const flushBuffer = () => {
//         if (buffer.length > 0) {
//             tokens.push(buffer);
//             buffer = '';
//         }
//     }

//     for (let i = 0; i< expression.length; i++) {
//         const char = expression[i];

//         // Skip whitespaces and store last found token
//         if (char === ' ') {
//             flushBuffer();
//             continue;
//         }

//         // If char is a number
//         if (!isNaN(Number.parseFloat(char))) {
//             buffer += char;

//             // If end of expression, store last token
//             if (i === expression.length - 1) {
//                 flushBuffer();
//             }

//             continue;
//         }

//         // If char is an operator
//         if (char === '+') {
//             flushBuffer();
//             tokens.push(char);
//             continue;
//         }
//     }

//     return tokens;
// };

// const input = '10 + 20'
// const result = tokenizer(input)
// console.log(result) // ['10', '+', '20']

// const input = '10 + 20 * 30 - 40'
// const tokenizer = new Tokenizer(input)

// console.log(tokenizer.getNextToken()) // {type: 'NUMBER', value: '10'}
// console.log(tokenizer.getNextToken()) // {type: '+', value: '+'}
// console.log(tokenizer.getNextToken()) // {type: 'NUMBER', value: '20'}
// console.log(tokenizer.getNextToken()) // {type: '*', value: '*'}
// console.log(tokenizer.getNextToken()) // {type: 'NUMBER', value: '30'}
// console.log(tokenizer.getNextToken()) // {type: '-', value: '-'}
// console.log(tokenizer.getNextToken()) // {type: 'NUMBER', value: '40'}
// console.log(tokenizer.getNextToken()) // 'null' because end of input reached!

// function printAllTokens(input) {
//   const tokenizer = new Tokenizer(input)

//   let token
//   while ((token = tokenizer.getNextToken()))
//     console.log(token)
// }

// printAllTokens(input)