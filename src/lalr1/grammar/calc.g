%lex

%%

\s+                        /* skip whitespace */
^(?:\d+(?:\.\d*)?|\.\d+)   return 'NUMBER'
\w+                        return 'FUNC_ID'

/lex

%{
  function trig(id, value) {
    switch (id) {
      case 'sin':
        return Math.sin(value);
      case 'cos':
        return Math.cos(value);
      case 'tan':
        return Math.tan(value);
      default:
        throw new Error(`Invalid operation: ${id}`);
    }
  }
%}

%left '+' '-'
%left '*' '/'
%right '^'

%%

e
  : e '+' e            { $$ = $1 + $3 }
  | e '-' e            { $$ = $1 - $3 }
  | e '*' e            { $$ = $1 * $3 }
  | e '/' e            { $$ = $1 / $3 }
  | e '^' e            { $$ = $1 ** $3 }
  | '(' e ')'          { $$ = $2 }
  | FUNC_ID '(' e ')'  { $$ = trig($1, $3) }
  | '-' e              { $$ = -$2 }
  | NUMBER             { $$ = Number($1) }
  ;
