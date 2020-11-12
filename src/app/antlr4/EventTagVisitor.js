// Generated from D:/Working/Julica/ReportingWidget/src/app/antlr4\EventTag.g4 by ANTLR 4.7.2
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by EventTagParser.

function EventTagVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

EventTagVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
EventTagVisitor.prototype.constructor = EventTagVisitor;

// Visit a parse tree produced by EventTagParser#main.
EventTagVisitor.prototype.visitMain = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by EventTagParser#BasicExpr.
EventTagVisitor.prototype.visitBasicExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by EventTagParser#BasicOp.
EventTagVisitor.prototype.visitBasicOp = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by EventTagParser#AddOp.
EventTagVisitor.prototype.visitAddOp = function(ctx) {
  return this.visitChildren(ctx);
};



exports.EventTagVisitor = EventTagVisitor;