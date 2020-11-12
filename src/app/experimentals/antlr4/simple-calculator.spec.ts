import * as antlr4 from 'antlr4';
import {SimpleCalculatorLexer} from './SimpleCalculatorLexer';
import {SimpleCalculatorVisitor} from './SimpleCalculatorVisitor';
import {SimpleCalculatorParser} from './SimpleCalculatorParser';

function EvalVisitor(): void {
  SimpleCalculatorVisitor.call(this);
  this.memory = {};
  return this;
}

EvalVisitor.prototype = Object.create(SimpleCalculatorVisitor.prototype);
EvalVisitor.prototype.constructor = EvalVisitor;

EvalVisitor.prototype.visitAssign = function(ctx) {
  const id = ctx.ID().getText();
  const value = +this.visit(ctx.expr());
  this.memory[id] = value;
  return value;
};

EvalVisitor.prototype.visitPrintExpr = function(ctx) {
  const value = this.visit(ctx.expr());
  return 0;
};

EvalVisitor.prototype.visitInt = function(ctx) {
  return +ctx.INT().getText();
};

EvalVisitor.prototype.visitId = function(ctx) {
  const id = ctx.ID().getText();
  if (this.memory[id]) {
    return this.memory[id];
  }
  return 0;
};

EvalVisitor.prototype.visitMulDiv = function(ctx) {
  const left = this.visit(ctx.expr(0));
  const right = this.visit(ctx.expr(1));

  if (ctx.op.type === SimpleCalculatorParser.MUL) {
    return left * right;
  }
  return left / right;
};

EvalVisitor.prototype.visitAddSub = function(ctx) {
  const left = this.visit(ctx.expr(0));
  const right = this.visit(ctx.expr(1));
  if (ctx.op.type === SimpleCalculatorParser.ADD) {
    return left + right;
  }
  return left - right;
};

EvalVisitor.prototype.visitParens = function(ctx) {
  return this.visit(ctx.expr());
};

describe('test simple calculator', () => {
  it('should print out correct result', () => {
    const message = '193\n' +
      'a = 5\n' +
      'b = 6\n' +
      'a+b*2\n' +
      '(1+2)*3\n';
    const input = new antlr4.InputStream(message);
    const lexer = new SimpleCalculatorLexer(input);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new SimpleCalculatorParser(tokens);
    const tree = parser.prog();

    // const walker = antlr4.tree.ParseTreeWalker.DEFAULT;
    // walker.walk(new EvalVisitor(), tree);
    const visitor = new EvalVisitor();
    visitor.visit(tree);
  });
});
