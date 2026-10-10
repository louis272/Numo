{{
    function operatorReducer (result, element) {
        const left = result;
        const right = element[3];
        const op = element[1];

        switch (op) {
            case '+':
                return left + right;
            case '-':
                return left - right;
            case '*':
                return left * right;
            case '/':
                return left / right;
            case '^':
                return left ** right;
            default:
                throw new Error(`Invalid operator: ${op}`);
       }
    }

    function trig (func, value) {
        switch (func) {
            case 'sin':
                return Math.sin(value);
            case 'cos':
                return Math.cos(value);
            case 'tan':
                return Math.tan(value);
            default:
                throw new Error(`Invalid operator: ${func}`);
        }
    }
}}

Expression
    = head:Term tail:(_ ("+" / "-") _ Term)* {
        return tail.reduce(operatorReducer, head);
    }


Term
    = head:Factor tail:(_ ("*" / "/") _ Factor)* {
        return tail.reduce(operatorReducer, head);
    }


Factor
    = head:Group tail:(_ "^" _ Factor)* {
        return tail.reduce(operatorReducer, head);
    }


Group
    = _ @Primary _


Primary
    = "(" _ @Expression _ ")"
    / "-" _ expr:Factor { return -expr; }
    / id:FUNC_ID "(" _ expr:Expression _ ")" { return trig(id, expr) }
    / Decimal { return parseFloat(text(), 10); }


Decimal
    = [0-9]* ("." [0-9]*)?


FUNC_ID
    = [a-z]+ { return text(); }


_ "whitespace"
    = [ \t\n\r]*