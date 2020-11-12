// Generated from D:/Working/Julica/ReportingWidget/src/app/antlr4\EventTag.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');
var EventTagListener = require('./EventTagListener').EventTagListener;
var EventTagVisitor = require('./EventTagVisitor').EventTagVisitor;

var grammarFileName = "EventTag.g4";


var serializedATN = ["\u0003\u608b\ua72a\u8133\ub9ed\u417c\u3be7\u7786\u5964",
    "\u0003\n\u0016\u0004\u0002\t\u0002\u0004\u0003\t\u0003\u0004\u0004\t",
    "\u0004\u0003\u0002\u0003\u0002\u0003\u0003\u0003\u0003\u0003\u0003\u0003",
    "\u0003\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0003\u0004\u0005",
    "\u0004\u0014\n\u0004\u0003\u0004\u0002\u0002\u0005\u0002\u0004\u0006",
    "\u0002\u0005\u0003\u0002\u0007\b\u0003\u0002\u0004\u0005\u0004\u0002",
    "\u0006\u0006\b\b\u0002\u0013\u0002\b\u0003\u0002\u0002\u0002\u0004\n",
    "\u0003\u0002\u0002\u0002\u0006\u0013\u0003\u0002\u0002\u0002\b\t\u0005",
    "\u0006\u0004\u0002\t\u0003\u0003\u0002\u0002\u0002\n\u000b\t\u0002\u0002",
    "\u0002\u000b\f\t\u0003\u0002\u0002\f\r\t\u0004\u0002\u0002\r\u0005\u0003",
    "\u0002\u0002\u0002\u000e\u0014\u0005\u0004\u0003\u0002\u000f\u0010\u0005",
    "\u0004\u0003\u0002\u0010\u0011\u0007\u0003\u0002\u0002\u0011\u0012\u0005",
    "\u0006\u0004\u0002\u0012\u0014\u0003\u0002\u0002\u0002\u0013\u000e\u0003",
    "\u0002\u0002\u0002\u0013\u000f\u0003\u0002\u0002\u0002\u0014\u0007\u0003",
    "\u0002\u0002\u0002\u0003\u0013"].join("");


var atn = new antlr4.atn.ATNDeserializer().deserialize(serializedATN);

var decisionsToDFA = atn.decisionToState.map( function(ds, index) { return new antlr4.dfa.DFA(ds, index); });

var sharedContextCache = new antlr4.PredictionContextCache();

var literalNames = [ null, null, "'='", "'!='" ];

var symbolicNames = [ null, "AND", "EQUAL", "NOTEQUAL", "NUMBER", "ID", 
                      "STRING", "NEWLINE", "WS" ];

var ruleNames =  [ "main", "basic_expr", "expr" ];

function EventTagParser (input) {
	antlr4.Parser.call(this, input);
    this._interp = new antlr4.atn.ParserATNSimulator(this, atn, decisionsToDFA, sharedContextCache);
    this.ruleNames = ruleNames;
    this.literalNames = literalNames;
    this.symbolicNames = symbolicNames;
    return this;
}

EventTagParser.prototype = Object.create(antlr4.Parser.prototype);
EventTagParser.prototype.constructor = EventTagParser;

Object.defineProperty(EventTagParser.prototype, "atn", {
	get : function() {
		return atn;
	}
});

EventTagParser.EOF = antlr4.Token.EOF;
EventTagParser.AND = 1;
EventTagParser.EQUAL = 2;
EventTagParser.NOTEQUAL = 3;
EventTagParser.NUMBER = 4;
EventTagParser.ID = 5;
EventTagParser.STRING = 6;
EventTagParser.NEWLINE = 7;
EventTagParser.WS = 8;

EventTagParser.RULE_main = 0;
EventTagParser.RULE_basic_expr = 1;
EventTagParser.RULE_expr = 2;


function MainContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = EventTagParser.RULE_main;
    return this;
}

MainContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
MainContext.prototype.constructor = MainContext;

MainContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

MainContext.prototype.enterRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.enterMain(this);
	}
};

MainContext.prototype.exitRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.exitMain(this);
	}
};

MainContext.prototype.accept = function(visitor) {
    if ( visitor instanceof EventTagVisitor ) {
        return visitor.visitMain(this);
    } else {
        return visitor.visitChildren(this);
    }
};




EventTagParser.MainContext = MainContext;

EventTagParser.prototype.main = function() {

    var localctx = new MainContext(this, this._ctx, this.state);
    this.enterRule(localctx, 0, EventTagParser.RULE_main);
    try {
        this.enterOuterAlt(localctx, 1);
        this.state = 6;
        this.expr();
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


function Basic_exprContext(parser, parent, invokingState) {
	if(parent===undefined) {
	    parent = null;
	}
	if(invokingState===undefined || invokingState===null) {
		invokingState = -1;
	}
	antlr4.ParserRuleContext.call(this, parent, invokingState);
    this.parser = parser;
    this.ruleIndex = EventTagParser.RULE_basic_expr;
    return this;
}

Basic_exprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
Basic_exprContext.prototype.constructor = Basic_exprContext;


 
Basic_exprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function BasicExprContext(parser, ctx) {
	Basic_exprContext.call(this, parser);
    this.op = null; // Token;
    Basic_exprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BasicExprContext.prototype = Object.create(Basic_exprContext.prototype);
BasicExprContext.prototype.constructor = BasicExprContext;

EventTagParser.BasicExprContext = BasicExprContext;

BasicExprContext.prototype.ID = function() {
    return this.getToken(EventTagParser.ID, 0);
};

BasicExprContext.prototype.STRING = function(i) {
	if(i===undefined) {
		i = null;
	}
    if(i===null) {
        return this.getTokens(EventTagParser.STRING);
    } else {
        return this.getToken(EventTagParser.STRING, i);
    }
};


BasicExprContext.prototype.NUMBER = function() {
    return this.getToken(EventTagParser.NUMBER, 0);
};

BasicExprContext.prototype.EQUAL = function() {
    return this.getToken(EventTagParser.EQUAL, 0);
};

BasicExprContext.prototype.NOTEQUAL = function() {
    return this.getToken(EventTagParser.NOTEQUAL, 0);
};
BasicExprContext.prototype.enterRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.enterBasicExpr(this);
	}
};

BasicExprContext.prototype.exitRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.exitBasicExpr(this);
	}
};

BasicExprContext.prototype.accept = function(visitor) {
    if ( visitor instanceof EventTagVisitor ) {
        return visitor.visitBasicExpr(this);
    } else {
        return visitor.visitChildren(this);
    }
};



EventTagParser.Basic_exprContext = Basic_exprContext;

EventTagParser.prototype.basic_expr = function() {

    var localctx = new Basic_exprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 2, EventTagParser.RULE_basic_expr);
    var _la = 0; // Token type
    try {
        localctx = new BasicExprContext(this, localctx);
        this.enterOuterAlt(localctx, 1);
        this.state = 8;
        _la = this._input.LA(1);
        if(!(_la===EventTagParser.ID || _la===EventTagParser.STRING)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 9;
        localctx.op = this._input.LT(1);
        _la = this._input.LA(1);
        if(!(_la===EventTagParser.EQUAL || _la===EventTagParser.NOTEQUAL)) {
            localctx.op = this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
        this.state = 10;
        _la = this._input.LA(1);
        if(!(_la===EventTagParser.NUMBER || _la===EventTagParser.STRING)) {
        this._errHandler.recoverInline(this);
        }
        else {
        	this._errHandler.reportMatch(this);
            this.consume();
        }
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
    this.ruleIndex = EventTagParser.RULE_expr;
    return this;
}

ExprContext.prototype = Object.create(antlr4.ParserRuleContext.prototype);
ExprContext.prototype.constructor = ExprContext;


 
ExprContext.prototype.copyFrom = function(ctx) {
    antlr4.ParserRuleContext.prototype.copyFrom.call(this, ctx);
};


function AddOpContext(parser, ctx) {
	ExprContext.call(this, parser);
    this.op = null; // Token;
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

AddOpContext.prototype = Object.create(ExprContext.prototype);
AddOpContext.prototype.constructor = AddOpContext;

EventTagParser.AddOpContext = AddOpContext;

AddOpContext.prototype.basic_expr = function() {
    return this.getTypedRuleContext(Basic_exprContext,0);
};

AddOpContext.prototype.expr = function() {
    return this.getTypedRuleContext(ExprContext,0);
};

AddOpContext.prototype.AND = function() {
    return this.getToken(EventTagParser.AND, 0);
};
AddOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.enterAddOp(this);
	}
};

AddOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.exitAddOp(this);
	}
};

AddOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof EventTagVisitor ) {
        return visitor.visitAddOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};


function BasicOpContext(parser, ctx) {
	ExprContext.call(this, parser);
    ExprContext.prototype.copyFrom.call(this, ctx);
    return this;
}

BasicOpContext.prototype = Object.create(ExprContext.prototype);
BasicOpContext.prototype.constructor = BasicOpContext;

EventTagParser.BasicOpContext = BasicOpContext;

BasicOpContext.prototype.basic_expr = function() {
    return this.getTypedRuleContext(Basic_exprContext,0);
};
BasicOpContext.prototype.enterRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.enterBasicOp(this);
	}
};

BasicOpContext.prototype.exitRule = function(listener) {
    if(listener instanceof EventTagListener ) {
        listener.exitBasicOp(this);
	}
};

BasicOpContext.prototype.accept = function(visitor) {
    if ( visitor instanceof EventTagVisitor ) {
        return visitor.visitBasicOp(this);
    } else {
        return visitor.visitChildren(this);
    }
};



EventTagParser.ExprContext = ExprContext;

EventTagParser.prototype.expr = function() {

    var localctx = new ExprContext(this, this._ctx, this.state);
    this.enterRule(localctx, 4, EventTagParser.RULE_expr);
    try {
        this.state = 17;
        this._errHandler.sync(this);
        var la_ = this._interp.adaptivePredict(this._input,0,this._ctx);
        switch(la_) {
        case 1:
            localctx = new BasicOpContext(this, localctx);
            this.enterOuterAlt(localctx, 1);
            this.state = 12;
            this.basic_expr();
            break;

        case 2:
            localctx = new AddOpContext(this, localctx);
            this.enterOuterAlt(localctx, 2);
            this.state = 13;
            this.basic_expr();
            this.state = 14;
            localctx.op = this.match(EventTagParser.AND);
            this.state = 15;
            this.expr();
            break;

        }
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


exports.EventTagParser = EventTagParser;
