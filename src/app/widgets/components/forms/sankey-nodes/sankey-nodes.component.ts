import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormArray, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {SankeyNode} from '../../../models';
import {distinctUntilChanged} from 'rxjs/operators';

@Component({
  selector: 'app-sankey-nodes',
  templateUrl: './sankey-nodes.component.html',
  styleUrls: ['./sankey-nodes.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SankeyNodesComponent),
      multi: true
    }
  ],
})
export class SankeyNodesComponent implements OnInit, ControlValueAccessor {
  private _fb: FormBuilder;

  form: FormGroup;
  expandingNode: number;

  @Input() required: boolean;

  constructor(fb: FormBuilder) {
    this._fb = fb;
  }

  get nodes(): FormArray {
    return this.form.get('nodes') as FormArray;
  }

  ngOnInit() {
    const validatorFns = this.required ? [Validators.required] : [];
    this.form = this._fb.group({
      nodes: this._fb.array([this.createNode()], validatorFns),
    });
    this.form.valueChanges
      .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe((value) => this._propagateChange(value.nodes));
  }

  writeValue(value: SankeyNode[]) {
    if (value) {
      this.form.setControl('nodes', this._fb.array(value));
    }
  }

  registerOnChange(fn: any) {
    this._propagateChange = fn;
  }

  registerOnTouched(fn: any) {
    // no op
  }

  handleAddNode() {
    this.nodes.push(this._fb.control(this.createNode()));
  }

  handleRemoveNode(index: number) {
    this.nodes.removeAt(index);
  }

  handleOpened(idx: number) {
    this.expandingNode = idx;
  }

  handleClosed(idx) {}

  private _propagateChange = (_: any) => {
    // no op
  }

  private createNode(): SankeyNode {
    return {id: null, column: null};
  }
}
