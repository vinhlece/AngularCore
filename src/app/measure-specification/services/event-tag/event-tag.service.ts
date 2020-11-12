import {Injectable} from '@angular/core';
import * as antlr4 from 'antlr4';
import {EventTagLexer} from '../../../antlr4/EventTagLexer';
import {EventTagParser} from '../../../antlr4/EventTagParser';
import {EventTagVisitor} from '../../../antlr4/EventTagVisitor';
import {ParameterQualifier} from '../../models/index';

function ExtractorVisitor(): void {
  EventTagVisitor.call(this);
  this.eventParams = [];
  return this;
}

ExtractorVisitor.prototype = Object.create(EventTagVisitor.prototype);
ExtractorVisitor.prototype.constructor = ExtractorVisitor;

ExtractorVisitor.prototype.visitMain = function (ctx) {
  this.visit(ctx.expr());
  return this.eventParams;
};

ExtractorVisitor.prototype.visitBasicOp = function (ctx) {
  this.visit(ctx.basic_expr());
};

ExtractorVisitor.prototype.visitBasicExpr = function (ctx) {
  const left = getChildText(ctx, 0);
  const right = getChildText(ctx, 2);
  const type = ctx.op.type === EventTagParser.EQUAL ? 'EQUALS' :
    ctx.op.type === EventTagParser.NOTEQUAL ? 'NOT_EQUALS' : ctx.op.type;
  this.eventParams.push({
    type,
    name: `body.userdata.${left}`,
    value: right
  });
};

ExtractorVisitor.prototype.visitAddOp = function (ctx) {
  this.visit(ctx.basic_expr());
  this.visit(ctx.expr());
};

function getChildText(ctx: any, index: number) {
  const element = ctx.children[index];
  if (element) {
    const text = element.getText();
    return /^".*"$/g.test(text) ? text.substr(1, text.length - 2) : text;
  }
  return null;
}

@Injectable()
export class EventTagService {
  private _tree: object;

  extract(query: string): ParameterQualifier[] {
    this._tree = this.buildParseTree(query);
    const visitor = new ExtractorVisitor();
    return visitor.visit(this._tree);
  }

  private buildParseTree(query: string): object {
    const input = new antlr4.InputStream(query);
    const lexer = new EventTagLexer(input);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new EventTagParser(tokens);
    return parser.main();
  }
}
