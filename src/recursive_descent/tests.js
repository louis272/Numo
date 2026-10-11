const assert = require('assert').strict
const { Parser } = require('./Parser')

const mathTests = [
    // Basics
    ['1', 1],
    [' 2 ', 2],
    ['0', 0],
    ['42', 42],

    // Whitespace handling
    [' 1 + 2 ', 3],
    ['1\n+\n2', 3],
    ['\t(1 + 2)\t* 3', 9],

    // Operator precedence
    ['1 + 2 * 3', 7],
    ['(1 + 2) * 3', 9],
    ['2 + 3 * 4', 14],
    ['100 - 10 * 5', 50],
    ['8 / 4 + 2', 4],
    ['2 * 3 ^ 2', 18],
    ['(2 + 3) ^ 2', 25],
    ['2 ^ (1 + 2)', 8],
    ['2 ^ 3 - 1', 7],
    ['1 + 6 / 2 * 3', 10],

    // Left associativity
    ['5 - 2', 3],
    ['5 - 2 - 1', 2],
    ['10 - 2 + 3', 11],
    ['12 / 2 / 3', 2],
    ['100 / 10 * 2', 20],
    ['64 / 4 / 2 / 2', 4],

    // Right associativity
    ['2 ^ 3 ^ 2', 512],

    // Parenthesized
    ['((2 + 3) * (4 - 1))', 15],
    ['(1 + (2 * (3 + 4)))', 15],
    ['2 * (3 + 4) * (5 - 2)', 42],

    // Unary minus
    ['-2 ^ 2', -4],
    ['(-2) ^ 2', 4],
    ['-2 ^ 2 + 1', -3],
    ['-5', -5],
    ['- 5', -5],
    ['- -5', 5],
    ['-(-3)', 3],
    ['-(2 + 3)', -5],
    ['-3 * 2', -6],
    ['3 * -2', -6],
    ['-2 ^ 2 * 3', -12],
    ['2 ^ -2', 0.25],
    ['-2 ^ -2', -0.25],

    // Decimals
    ['0.5', 0.5],
    ['1.5 + 2.25', 3.75],
    ['3.5 * 2', 7],
    ['10 / 4', 2.5],
    ['4 ^ 0.5', 2],

    // Exponents
    ['2 ^ 3 + 1', 9],
    ['2 ^ 10', 1024],
    ['0 ^ 0', 1],
    ['5 ^ 1', 5],
    ['1 ^ 100', 1],

    // Division semantics
    ['7 / 2', 3.5],
    ['1 / 0', Infinity],

    // Functions
    ['cos(0) + 3 * -4 / -2 ^ 2', 4],
    ['sin(0)', 0],
    ['cos(0)', 1],
    ['tan(0)', 0],
    ['2 * cos(0)', 2],
    ['sin(0) ^ 2 + cos(0) ^ 2', 1],
    ['1 - sin(0) - cos(0)', 0],
    ['sin(2) * 3', Math.sin(2) * 3],
    ['cos(2 ^ 3)', Math.cos(8)],
    ['sin(cos(0))', Math.sin(1)],
    ['tan(0.5)', Math.tan(0.5)]
]

const errorTests = [
    // Empty / truncated input
    ['', SyntaxError, /Unexpected end of expression/],
    ['sin(', SyntaxError, /Unexpected end of expression/],

    // Malformed expressions
    ['1 + +', SyntaxError, /expected "NUMBER"/],
    ['(1 + 2', SyntaxError, /Unexpected end/],
    ['sin(1', SyntaxError, /Unexpected end/],
    ['* 3', SyntaxError, /expected "NUMBER"/],
    ['cos 0', SyntaxError, /expected "\("/],
    ['()', SyntaxError, /expected "NUMBER"/],
    ['1 & 2', SyntaxError],

    // Unknown functions
    ['foo(1)', Error, /Invalid operation: foo/],
    ['1 + foo(2)', Error, /Invalid operation: foo/]
]

const parser = new Parser()
let result

for (const [expression, expected] of mathTests) {
    try {
        result = parser.parse(expression)
        assert.equal(result, expected)
    } catch (err) {
        const lines = '-'.repeat(process.stdout.columns)
        console.log(lines)
        console.log(`Expression failed: "${expression}"`)
        console.log(`Expected result: ${expected}`)
        console.log(`Actual result: ${result}`)
        console.log(lines)
        throw err
    }
}

for (const [expression, errorType, messageRegex] of errorTests) {
  try {
    parser.parse(expression)
    const lines = '-'.repeat(process.stdout.columns)
    console.log(lines)
    console.log(`Error test failed: "${expression}"`)
    console.log(`Expected error: ${errorType.name}`)
    console.log('Actual result: no error thrown')
    console.log(lines)
    throw new assert.AssertionError({ message: `Expected "${expression}" to throw ${errorType.name}` })
  } catch (err) {
    if (err instanceof assert.AssertionError) throw err

    assert.ok(err instanceof errorType,
      `"${expression}" threw ${err.constructor.name} ("${err.message}"), expected ${errorType.name}`)
    if (messageRegex) {
      assert.ok(messageRegex.test(err.message),
        `"${expression}" error message "${err.message}" does not match ${messageRegex}`)
    }
  }
}

console.log('All tests passed!')
