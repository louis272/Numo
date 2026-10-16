# Numo

Numo is a collection of small math expression parsers and a Tiny Math Language (TML) interpreter written in JavaScript.

The TML implementation supports variables, arithmetic expressions, function
calls, and `print` statements. 

The project follows the [Math Expression Parser in JavaScript](https://inspirnathan.com/posts/149-math-expression-parser-in-javascript) series and explores several parsing techniques:

- RPN evaluator
- Shunting yard algorithm
- LL parser generator
- LR parser generator
- PEG parser generator
- Recursive descent parser
- Pratt parser

## Run an example

```bash
node src/pratt/ast-example.js
node src/shunting_yard/main.js
```

## Project structure

Each parser implementation is under `src/` with its grammar, tokenizer, parser, and examples where applicable.

The `src/tml` directory contains the TML grammar, parser, AST support, and
command-line runner:

```bash
node src/tml/tml-runner src/tml/example.tml
```

Example TML program:

```tml
var x = 1;
var y = 2;
print(x + y);
```
