import {Comparable} from '../../shared/collection';

export class PrimitiveWrapper implements Comparable<PrimitiveWrapper> {
  private _content: string | number;

  constructor(content: string | number) {
    this._content = content;
  }

  get content(): string | number {
    return this._content;
  }

  compareWith(other: PrimitiveWrapper): number {
    if (this.content > other.content) {
      return 1;
    } else if (this.content < other.content) {
      return -1;
    }
    return 0;
  }
}
