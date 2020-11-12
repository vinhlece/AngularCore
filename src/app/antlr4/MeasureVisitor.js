// Generated from ../src/app/antlr4/Measure.g4 by ANTLR 4.7.1
// jshint ignore: start
var antlr4 = require('antlr4/index');

// This class defines a complete generic visitor for a parse tree produced by MeasureParser.

function MeasureVisitor() {
	antlr4.tree.ParseTreeVisitor.call(this);
	return this;
}

MeasureVisitor.prototype = Object.create(antlr4.tree.ParseTreeVisitor.prototype);
MeasureVisitor.prototype.constructor = MeasureVisitor;

// Visit a parse tree produced by MeasureParser#main.
MeasureVisitor.prototype.visitMain = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by MeasureParser#parens.
MeasureVisitor.prototype.visitParens = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by MeasureParser#MulDiv.
MeasureVisitor.prototype.visitMulDiv = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by MeasureParser#AddSub.
MeasureVisitor.prototype.visitAddSub = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by MeasureParser#id.
MeasureVisitor.prototype.visitId = function(ctx) {
  return this.visitChildren(ctx);
};


// Visit a parse tree produced by MeasureParser#int.
MeasureVisitor.prototype.visitInt = function(ctx) {
  return this.visitChildren(ctx);
};



exports.MeasureVisitor = MeasureVisitor;