// Generated from ../src/app/antlr4/Measure.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');
var MeasureVisitor = require('./MeasureVisitor').MeasureVisitor;

var grammarFileName = "Measure.g4";

var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\f\u001d\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0003\u0002\u0003",
    "\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0005\u0003\u0010\n\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0003\u0007\u0003\u0018\n",
    "\u0003\f\u0003\u000e\u0003\u001b\u000b\u0003\u0003\u0003\u0002\u0003",
    "\u0004\u0004\u0002\u0004\u0002\u0004\u0003\u0002\u0005\u0006\u0003\u0002",
    "\u0007\b\u0002\u001e\u0002\u0006\u0003\u0002\u0002\u0002\u0004\u000f",
    "\u0003\u0002\u0002\u0002\u0006\u0007\u0005\u0004\u0003\u0002\u0007\u0003",
    "\u0003\u0002\u0002\u0002\b\t\b\u0003\u0001\u0002\t\u0010\u0007\n\u0002",
    "\u0002\n\u0010\u0007\t\u0002\u0002\u000b\f\u0007\u0003\u0002\u0002\f",
    "\r\u0005\u0004\u0003\u0002\r\u000e\u0007\u0004\u0002\u0002\u000e\u0010",
    "\u0003\u0002\u0002\u0002\u000f\b\u0003\u0002\u0002\u0002\u000f\n\u0003",
    "\u0002\u0002\u0002\u000f\u000b\u0003\u0002\u0002\u0002\u0010\u0019\u0003",
    "\u0002\u0002\u0002\u0011\u0012\f\u0007\u0002\u0002\u0012\u0013\t\u0002",
    "\u0002\u0002\u0013\u0018\u0005\u0004\u0003\b\u0014\u0015\f\u0006\u0002",
    "\u0002\u0015\u0016\t\u0003\u0002\u0002\u0016\u0018\u0005\u0004\u0003",
    "\u0007\u0017\u0011\u0003\u0002\u0002\u0002\u0017\u0014\u0003\u0002\u0002",
    "\u0002\u0018\u001b\u0003\u0002\u0002\u0002\u0019\u0017\u0003\u0002\u0002",
    "\u0002\u0019\u001a\u0003\u0002\u0002\u0002\u001a\u0005\u0003\u0002\u0002",
    "\u0002\u001b\u0019\u0003\u0002\u0002\u0002\u0005\u000f\u0017\u0019"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, "'('", "')'", "'*'", "'/'", "'+'", "'-'" ];

var symbolicNames = [ null, null, null, "MUL", "DIV", "ADD", "SUB", "ID", 
                      "INT", "NEWLINE", "WS" ];

var ruleNames =  [ "main", "expr" ];

function MeasureParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

MeasureParser.prototype = Object.create(antlr4.Parser.prototype);
MeasureParser.prototype.constructor = MeasureParser;

Object.defineProperty(MeasureParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

MeasureParser.EOF = antlr4.Token.EOF;
MeasureParser.T__0 = 1;
MeasureParser.T__1 = 2;
MeasureParser.MUL = 3;
MeasureParser.DIV = 4;
MeasureParser.ADD = 5;
MeasureParser.SUB = 6;
MeasureParser.ID = 7;
MeasureParser.INT = 8;
MeasureParser.NEWLINE = 9;
MeasureParser.WS = 10;

MeasureParser.RULE_main = 0;
MeasureParser.RULE_expr = 1;

function MainContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = MeasureParser.RULE_main;
    return this;
}

MainContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MainContext.prototype.constructor = MainContext;

MainContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

MainContext.prototype.accept = function(visitor) {
    if ( visitor instanceof MeasureVisitor ) {
        return visitor.visitMain(this);
    } else {
        return visitor.visitChildren(this);
    }
};




MeasureParser.MainContext = MainContext;

MeasureParser.prototype.main = function() {

    var localctx = new MainContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, MeasureParser.RULE_main);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 4;
        this.expr(0);
    } catch (re) {
    	if(re instanceof antlr4.error.RecognitionException) {
	        localctx.exception = re;
	        this._errHandler.reportError(this, re);
	        this._errHandler.recover(this, re);
	    } else {
	    	throw re;
	    }
    } finally {
        this.exitRule();
    }
    return localctx;
};

function ExprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = MeasureParser.RULE_expr;
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;


 
ExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};

function ParensContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

ParensContext.prototype = Object.create(ExprContext.prototype);
ParensContext.prototype.constructor = ParensContext;

MeasureParser.ParensContext = ParensContext;

ParensContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};
ParensContext.prototype.accept = function(visitor) {
    if ( visitor instanceof MeasureVisitor ) {
        return visitor.visitParens(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function MulDivContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

MulDivContext.prototype = Object.create(ExprContext.prototype);
MulDivContext.prototype.constructor = MulDivContext;

MeasureParser.MulDivContext = MulDivContext;

MulDivContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

MulDivContext.prototype.MUL = function() {
    return this.getToken(MeasureParser.MUL, 0);
};

MulDivContext.prototype.DIV = function() {
    return this.getToken(MeasureParser.DIV, 0);
};
MulDivContext.prototype.accept = function(visitor) {
    if ( visitor instanceof MeasureVisitor ) {
        return visitor.visitMulDiv(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function AddSubContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AddSubContext.prototype = Object.create(ExprContext.prototype);
AddSubContext.prototype.constructor = AddSubContext;

MeasureParser.AddSubContext = AddSubContext;

AddSubContext.prototype.expr = function(i) {
    if(i===undefined) {
        i = null;
    }
    if(i===null) {
        return this.getTypedRuleContexts(ExprContext);
    } else {
        return this.getTypedRuleContext(ExprContext,i);
    }
};

AddSubContext.prototype.ADD = function() {
    return this.getToken(MeasureParser.ADD, 0);
};

AddSubContext.prototype.SUB = function() {
    return this.getToken(MeasureParser.SUB, 0);
};
AddSubContext.prototype.accept = function(visitor) {
    if ( visitor instanceof MeasureVisitor ) {
        return visitor.visitAddSub(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function IdContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IdContext.prototype = Object.create(ExprContext.prototype);
IdContext.prototype.constructor = IdContext;

MeasureParser.IdContext = IdContext;

IdContext.prototype.ID = function() {
    return this.getToken(MeasureParser.ID, 0);
};
IdContext.prototype.accept = function(visitor) {
    if ( visitor instanceof MeasureVisitor ) {
        return visitor.visitId(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function IntContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

IntContext.prototype = Object.create(ExprContext.prototype);
IntContext.prototype.constructor = IntContext;

MeasureParser.IntContext = IntContext;

IntContext.prototype.INT = function() {
    return this.getToken(MeasureParser.INT, 0);
};
IntContext.prototype.accept = function(visitor) {
    if ( visitor instanceof MeasureVisitor ) {
        return visitor.visitInt(this);
    } else {
        return visitor.visitChildren(this);
    }
};



MeasureParser.prototype.expr = function(_p) {
	if(_p===undefined) {
	    _p = 0;
	}
    var _parentctx = this._ctx;
    var _parentState = this.state;
    var localctx = new ExprContext(this, this._ctx, _parentState);
    var _prevctx = localctx;
    var _startState = 2;
    this.enterRecursionRule(localctx, 2, MeasureParser.RULE_expr, _p);
    var _la = 0; // Token type
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 13;
        this._errHandler.sync(this);
        switch(this._input.LA(1)) {
        case MeasureParser.INT:
            localctx = new IntContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;

            this.state = 7;
            this.match(MeasureParser.INT);
            break;
        case MeasureParser.ID:
            localctx = new IdContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 8;
            this.match(MeasureParser.ID);
            break;
        case MeasureParser.T__0:
            localctx = new ParensContext(this, localctx);
            this._ctx = localctx;
            _prevctx = localctx;
            this.state = 9;
            this.match(MeasureParser.T__0);
            this.state = 10;
            this.expr(0);
            this.state = 11;
            this.match(MeasureParser.T__1);
            break;
        default:
            throw new antlr4.error.NoViableAltException(this);
        }
        this._ctx.stop = this._input.LT(-1);
        this.state = 23;
        this._errHandler.sync(this);
        var _alt = this._interp.adaptivePredict(this._input,2,this._ctx)
        while(_alt!=2 && _alt!=antlr4.atn.ATN.INVALID_ALT_NUMBER) {
            if(_alt===1) {
                if(this._parseListeners!==null) {
                    this.triggerExitRuleEvent();
                }
                _prevctx = localctx;
                this.state = 21;
                this._errHandler.sync(this);
                var la_ = this._interp.adaptivePredict(this._input,1,this._ctx);
                switch(la_) {
                case 1:
                    localctx = new MulDivContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, MeasureParser.RULE_expr);
                    this.state = 15;
                    if (!( this.precpred(this._ctx, 5))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 5)");
                    }
                    this.state = 16;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===MeasureParser.MUL || _la===MeasureParser.DIV)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 17;
                    this.expr(6);
                    break;

                case 2:
                    localctx = new AddSubContext(this, new ExprContext(this, _parentctx, _parentState));
                    this.pushNewRecursionContext(localctx, _startState, MeasureParser.RULE_expr);
                    this.state = 18;
                    if (!( this.precpred(this._ctx, 4))) {
                        throw new antlr4.error.FailedPredicateException(this, "this.precpred(this._ctx, 4)");
                    }
                    this.state = 19;
                    localctx.op = this._input.LT(1);
                    _la = this._input.LA(1);
                    if(!(_la===MeasureParser.ADD || _la===MeasureParser.SUB)) {
                        localctx.op = this._errHandler.recoverInline(this);
                    }
                    else {
                    	this._errHandler.reportMatch(this);
                        this.consume();
                    }
                    this.state = 20;
                    this.expr(5);
                    break;

                } 
            }
            this.state = 25;
            this._errHandler.sync(this);
            _alt = this._interp.adaptivePredict(this._input,2,this._ctx);
        }

    } catch( error) {
        if(error instanceof antlr4.error.RecognitionException) {
	        localctx.exception = error;
	        this._errHandler.reportError(this, error);
	        this._errHandler.recover(this, error);
	    } else {
	    	throw error;
	    }
    } finally {
        this.unrollRecursionContexts(_parentctx)
    }
    return localctx;
};


MeasureParser.prototype.sempred = function(localctx, ruleIndex, predIndex) {
	switch(ruleIndex) {
	case 1:
			return this.expr_sempred(localctx, predIndex);
    default:
        throw "No predicate with index:" + ruleIndex;
   }
};

MeasureParser.prototype.expr_sempred = function(localctx, predIndex) {
	switch(predIndex) {
		case 0:
			return this.precpred(this._ctx, 5);
		case 1:
			return this.precpred(this._ctx, 4);
		default:
			throw "No predicate with index:" + predIndex;
	}
};


exports.MeasureParser = MeasureParser;
