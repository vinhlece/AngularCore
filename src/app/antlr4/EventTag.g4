grammar EventTag; // rename to distinguish from Expr.g4
import CommonLexerRules;

main       :  expr;

basic_expr : (ID | STRING) op=(EQUAL | NOTEQUAL) (STRING | NUMBER)  #BasicExpr;

expr       :  basic_expr                                            # BasicOp
           | (basic_expr op=AND expr)                               # AddOp
           ;

AND      :  [aA][nN][dD]                    ;
EQUAL    :  '='                             ;
NOTEQUAL :  '!='                            ;
NUMBER   :  '-'? INT ('.' [0-9] +)? EXP?    ;
ID       :  [a-zA-Z][a-zA-Z0-9]*            ;
STRING   :  '"' (ESC | SAFECODEPOINT)* '"'  ;

fragment  INT           : '0' | [1-9] [0-9]*           ;
fragment  EXP           : [Ee] [+\-]? INT              ;
fragment  ESC           : '\\' (["\\/bfnrt] | UNICODE) ;
fragment  UNICODE       : 'u' HEX HEX HEX HEX          ;
fragment  HEX           : [0-9a-fA-F]                  ;
fragment  SAFECODEPOINT : ~ ["\\\u0000-\u001F]         ;
