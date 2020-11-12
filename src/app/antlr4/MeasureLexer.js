// Generated from ../src/app/antlr4/Measure.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0002\f9\b\u0001\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004",
    "\t\u0004\u0004\u0005\t\u0005\u0004\u0006\t\u0006\u0004\u0007\t\u0007",
    "\u0004\b\t\b\u0004\t\t\t\u0004\n\t\n\u0004\u000b\t\u000b\u0003\u0002",
    "\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0004\u0003\u0004\u0003\u0005",
    "\u0003\u0005\u0003\u0006\u0003\u0006\u0003\u0007\u0003\u0007\u0003\b",
    "\u0006\b%\n\b\r\b\u000e\b&\u0003\t\u0006\t*\n\t\r\t\u000e\t+\u0003\n",
    "\u0005\n/\n\n\u0003\n\u0003\n\u0003\u000b\u0006\u000b4\n\u000b\r\u000b",
    "\u000e\u000b5\u0003\u000b\u0003\u000b\u0002\u0002\f\u0003\u0003\u0005",
    "\u0004\u0007\u0005\t\u0006\u000b\u0007\r\b\u000f\t\u0011\n\u0013\u000b",
    "\u0015\f\u0003\u0002\u0005\u0004\u0002C\\c|\u0003\u00022;\u0004\u0002",
    "\u000b\u000b\"\"\u0002<\u0002\u0003\u0003\u0002\u0002\u0002\u0002\u0005",
    "\u0003\u0002\u0002\u0002\u0002\u0007\u0003\u0002\u0002\u0002\u0002\t",
    "\u0003\u0002\u0002\u0002\u0002\u000b\u0003\u0002\u0002\u0002\u0002\r",
    "\u0003\u0002\u0002\u0002\u0002\u000f\u0003\u0002\u0002\u0002\u0002\u0011",
    "\u0003\u0002\u0002\u0002\u0002\u0013\u0003\u0002\u0002\u0002\u0002\u0015",
    "\u0003\u0002\u0002\u0002\u0003\u0017\u0003\u0002\u0002\u0002\u0005\u0019",
    "\u0003\u0002\u0002\u0002\u0007\u001b\u0003\u0002\u0002\u0002\t\u001d",
    "\u0003\u0002\u0002\u0002\u000b\u001f\u0003\u0002\u0002\u0002\r!\u0003",
    "\u0002\u0002\u0002\u000f$\u0003\u0002\u0002\u0002\u0011)\u0003\u0002",
    "\u0002\u0002\u0013.\u0003\u0002\u0002\u0002\u00153\u0003\u0002\u0002",
    "\u0002\u0017\u0018\u0007*\u0002\u0002\u0018\u0004\u0003\u0002\u0002",
    "\u0002\u0019\u001a\u0007+\u0002\u0002\u001a\u0006\u0003\u0002\u0002",
    "\u0002\u001b\u001c\u0007,\u0002\u0002\u001c\b\u0003\u0002\u0002\u0002",
    "\u001d\u001e\u00071\u0002\u0002\u001e\n\u0003\u0002\u0002\u0002\u001f",
    " \u0007-\u0002\u0002 \f\u0003\u0002\u0002\u0002!\"\u0007/\u0002\u0002",
    "\"\u000e\u0003\u0002\u0002\u0002#%\t\u0002\u0002\u0002$#\u0003\u0002",
    "\u0002\u0002%&\u0003\u0002\u0002\u0002&$\u0003\u0002\u0002\u0002&\'",
    "\u0003\u0002\u0002\u0002\'\u0010\u0003\u0002\u0002\u0002(*\t\u0003\u0002",
    "\u0002)(\u0003\u0002\u0002\u0002*+\u0003\u0002\u0002\u0002+)\u0003\u0002",
    "\u0002\u0002+,\u0003\u0002\u0002\u0002,\u0012\u0003\u0002\u0002\u0002",
    "-/\u0007\u000f\u0002\u0002.-\u0003\u0002\u0002\u0002./\u0003\u0002\u0002",
    "\u0002/0\u0003\u0002\u0002\u000201\u0007\f\u0002\u00021\u0014\u0003",
    "\u0002\u0002\u000224\t\u0004\u0002\u000232\u0003\u0002\u0002\u00024",
    "5\u0003\u0002\u0002\u000253\u0003\u0002\u0002\u000256\u0003\u0002\u0002",
    "\u000267\u0003\u0002\u0002\u000278\b\u000b\u0002\u00028\u0016\u0003",
    "\u0002\u0002\u0002\u0007\u0002&+.5\u0003\b\u0002\u0002"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

function MeasureLexer(input) {
	antlr4.Lexer.call(this, input);
    this._interp = new antlr4.atn.LexerATNSimulator(this, atn, decisionsToDFA, new antlr4.PredictionContextCache());
    return this;
}

MeasureLexer.prototype = Object.create(antlr4.Lexer.prototype);
MeasureLexer.prototype.constructor = MeasureLexer;

Object.defineProperty(MeasureLexer.prototype, "atn", {
        get : function() {
                return atn;
        }
});

MeasureLexer.EOF = antlr4.Token.EOF;
MeasureLexer.T__0 = 1;
MeasureLexer.T__1 = 2;
MeasureLexer.MUL = 3;
MeasureLexer.DIV = 4;
MeasureLexer.ADD = 5;
MeasureLexer.SUB = 6;
MeasureLexer.ID = 7;
MeasureLexer.INT = 8;
MeasureLexer.NEWLINE = 9;
MeasureLexer.WS = 10;

MeasureLexer.prototype.channelNames = [ "DEFAULT_TOKEN_CHANNEL", "HIDDEN" ];

MeasureLexer.prototype.modeNames = [ "DEFAULT_MODE" ];

MeasureLexer.prototype.literalNames = [ null, "'('", "')'", "'*'", "'/'", 
                                        "'+'", "'-'" ];

MeasureLexer.prototype.symbolicNames = [ null, null, null, "MUL", "DIV", 
                                         "ADD", "SUB", "ID", "INT", "NEWLINE", 
                                         "WS" ];

MeasureLexer.prototype.ruleNames = [ "T__0", "T__1", "MUL", "DIV", "ADD", 
                                     "SUB", "ID", "INT", "NEWLINE", "WS" ];

MeasureLexer.prototype.grammarFileName = "Measure.g4";



exports.MeasureLexer = MeasureLexer;

