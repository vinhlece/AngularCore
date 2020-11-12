import { Directive, ElementRef, AfterViewInit, Input, Renderer2 } from "@angular/core";

/**
 * Used to add "Show More..." link to live event data where the data is over the specified input value.
 */
@Directive(
    {
        selector: '[liveEvent]'
    }
)
export class LiveEventDirective implements AfterViewInit {

    showMoreLink: HTMLAnchorElement;

    @Input() liveEvent: number;

    constructor(private ele: ElementRef, private renderer: Renderer2) { }

    ngAfterViewInit() {
        const originalText = this.ele.nativeElement.textContent;
        if (originalText.length > this.liveEvent) {
            const croppedText = originalText.substring(0, this.liveEvent);
            this.ele.nativeElement.textContent = croppedText;
            this.showMoreLink = this.renderer.createElement('a');
            this.showMoreLink.textContent = "Show More...";
            this.showMoreLink.setAttribute('class', 'show-more-event-link');
            this.renderer.appendChild(this.ele.nativeElement, this.showMoreLink);
            this.showMoreLink.addEventListener('click', () => {
                if (this.showMoreLink.textContent === "Show More...") {
                    this.showMoreLink.textContent = "Show Less...";
                    this.ele.nativeElement.textContent = originalText;
                    this.renderer.appendChild(this.ele.nativeElement, this.showMoreLink);
                } else {
                    this.showMoreLink.textContent = "Show More...";
                    this.ele.nativeElement.textContent = croppedText;
                    this.renderer.appendChild(this.ele.nativeElement, this.showMoreLink);
                }
            });
        }
    }
}