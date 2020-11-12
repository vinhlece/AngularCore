// Generated from ../src/app/experimentals/antlr4/SimpleCalculator.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by SimpleCalculatorParser.

function SimpleCalculatorVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

SimpleCalculatorVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
SimpleCalculatorVisitor.prototype.constructor = SimpleCalculatorVisitor;

// Visit a parse tree produced by SimpleCalculatorParser#prog.
SimpleCalculatorVisitor.prototype.visitProg = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#printExpr.
SimpleCalculatorVisitor.prototype.visitPrintExpr = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#assign.
SimpleCalculatorVisitor.prototype.visitAssign = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#blank.
SimpleCalculatorVisitor.prototype.visitBlank = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#parens.
SimpleCalculatorVisitor.prototype.visitParens = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#MulDiv.
SimpleCalculatorVisitor.prototype.visitMulDiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#AddSub.
SimpleCalculatorVisitor.prototype.visitAddSub = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#id.
SimpleCalculatorVisitor.prototype.visitId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by SimpleCalculatorParser#int.
SimpleCalculatorVisitor.prototype.visitInt = function(ctx) {
  return this.visitChildren(ctx);
};



exports.SimpleCalculatorVisitor = SimpleCalculatorVisitor;