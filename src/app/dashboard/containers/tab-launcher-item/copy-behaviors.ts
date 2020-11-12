export interface CopyBehavior {
  copyEmbeddedWidget(): void;
}

export class DoNotCopy implements CopyBehavior {
  copyEmbeddedWidget(): void {
    // no op
  }
}

export class CopyBehaviorImpl {
  private _placeholderId: string;

  embeddedWidget: string;

  constructor(placeholderId: string) {
    this._placeholderId = placeholderId;
  }

  copyEmbeddedWidget(): void {
    this.createEmbeddedWidget(this._placeholderId);
    this.copyToClipboard();
  }

  private createEmbeddedWidget(placeholderId: string): void {
    const classAttr = 'class="widget"';
    const placeholderAttr = `placeholder-id="${placeholderId}"`;
    const styleAttr = 'style="width: 512px; height: 512px;"';
    this.embeddedWidget = `<widget-launcher ${classAttr} ${placeholderAttr} ${styleAttr}></widget-launcher>`;
  }

  private copyToClipboard(): void {
    const helperBox = document.createElement('textarea');
    helperBox.style.position = 'fixed';
    helperBox.style.left = '0';
    helperBox.style.top = '0';
    helperBox.style.opacity = '0';
    helperBox.value = this.embeddedWidget;

    document.body.appendChild(helperBox);
    helperBox.focus();
    helperBox.select();

    document.execCommand('copy');
    document.body.removeChild(helperBox);
  }
}
