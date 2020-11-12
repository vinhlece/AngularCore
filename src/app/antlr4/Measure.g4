grammar Measure; // rename to distinguish from Expr.g4
import CommonLexerRules;

main:   expr
        ;

expr:   expr op=(MUL | DIV) expr      # MulDiv
    |   expr op=(ADD | SUB) expr      # AddSub
    |   INT                           # int
    |   ID                            # id
    |   '(' expr ')'                  # parens
    ;

MUL :   '*' ; // assigns token name to '*' used above in grammar
DIV :   '/' ;
ADD :   '+' ;
SUB :   '-' ;
