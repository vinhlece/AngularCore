import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as antlr4 from 'antlr4';
import {first} from 'rxjs/operators';
import {FormulaMeasureFactory} from '..';
import {MeasureLexer} from '../../../antlr4/MeasureLexer';
import {MeasureParser} from '../../../antlr4/MeasureParser';
import {MeasureVisitor} from '../../../antlr4/MeasureVisitor';
import {FormulaMeasure, Measure} from '../../models';
import * as fromMeasures from '../../reducers';

function EvalVisitor(operands): void {
  MeasureVisitor.call(this);
  this.operands = operands;
  return this;
}

EvalVisitor.prototype = Object.create(MeasureVisitor.prototype);
EvalVisitor.prototype.constructor = EvalVisitor;

EvalVisitor.prototype.visitMain = function (ctx) {
  return this.visit(ctx.expr());
};

EvalVisitor.prototype.visitInt = function (ctx) {
  return +ctx.INT().getText();
};

EvalVisitor.prototype.visitId = function (ctx) {
  const id = ctx.ID().getText();
  const operand = this.operands.find(item => item.measureName === id);
  if (operand) {
    return operand.measureValue;
  }
  return 0;
};

EvalVisitor.prototype.visitMulDiv = function (ctx) {
  const left = this.visit(ctx.expr(0));
  const right = this.visit(ctx.expr(1));

  if (ctx.op.type === MeasureParser.MUL) {
    return left * right;
  }
  return left / right;
};

EvalVisitor.prototype.visitAddSub = function (ctx) {
  const left = this.visit(ctx.expr(0));
  const right = this.visit(ctx.expr(1));
  if (ctx.op.type === MeasureParser.ADD) {
    return left + right;
  }
  return left - right;
};

EvalVisitor.prototype.visitParens = function (ctx) {
  return this.visit(ctx.expr());
};

function ExtractorVisitor(): void {
  MeasureVisitor.call(this);
  this.measures = [];
  return this;
}

ExtractorVisitor.prototype = Object.create(MeasureVisitor.prototype);
ExtractorVisitor.prototype.constructor = ExtractorVisitor;

ExtractorVisitor.prototype.visitMain = function (ctx) {
  this.visit(ctx.expr());
  return this.measures;
};

ExtractorVisitor.prototype.visitId = function (ctx) {
  const id = ctx.ID().getText();
  if (this.measures.indexOf(id) === -1) {
    this.measures.push(id);
  }
};

export class FormulaMeasureImpl implements FormulaMeasure {
  expression: string;
  name: string;
  format: string = 'number';
  relatedMeasures: string[];

  private _tree: object;

  constructor(name: string, expression: string) {
    this.name = name;
    this.expression = expression;
    this._tree = this.buildParseTree();
  }

  calculate(operands: { measureName: string, measureValue: number }[]): number {
    const visitor = new EvalVisitor(operands);
    return visitor.visit(this._tree);
  }

  extract(): string[] {
    const visitor = new ExtractorVisitor();
    return visitor.visit(this._tree);
  }

  private buildParseTree(): object {
    const input = new antlr4.InputStream(this.expression);
    const lexer = new MeasureLexer(input);
    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new MeasureParser(tokens);
    return parser.main();
  }
}

export class NullFormulaMeasure implements FormulaMeasure {
  expression: string;
  name: string;
  relatedMeasures: string[];

  calculate(operands: { measureName: string, measureValue: number }[]): number {
    throw new TypeError('Calculation can not be applied to null formula measure');
  }

  extract(): string[] {
    throw new TypeError('Extract measure can not be applied to null formula measureName');
  }
}

@Injectable()
export class FormulaMeasureFactoryImpl implements FormulaMeasureFactory {
  private _store: Store<fromMeasures.State>;
  private _cachedFormulaMeasures = {};

  constructor(store: Store<fromMeasures.State>) {
    this._store = store;
  }

  create(measureName: string): FormulaMeasure {
    let formulaMeasure = this._cachedFormulaMeasures[measureName];
    if (!formulaMeasure) {
      this._store
        .pipe(
          select(fromMeasures.getFormulaMeasureByName(measureName)),
          first()
        )
        .subscribe((measure: Measure) => {
          formulaMeasure = measure
            ? new FormulaMeasureImpl(measure.name, (measure as FormulaMeasure).expression)
            : new NullFormulaMeasure();
        });
      this._cachedFormulaMeasures[measureName] = formulaMeasure;
    }
    return formulaMeasure;
  }
}

@Injectable()
export class SandBoxFormulaMeasureFactory implements FormulaMeasureFactory {
  create(measureName: string): FormulaMeasure {
    return new NullFormulaMeasure();
  }
}
