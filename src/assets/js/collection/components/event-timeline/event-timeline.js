import { initTimeline } from './timeline';
export class MyComponent {
    componentDidLoad() {
        console.log('loading timeline');
        setTimeout(() => {
            initTimeline();
        }, 1000);
    }
    render() {
        console.log('render called');
        // let heythere = hey();
        // return <div>{this.heyhey()} Hello, World! I'm {this.format()}</div>;
        this.el.style.setProperty('background-color', 'green');
        return h("div", null);
    }
    static get is() { return "event-timeline"; }
    static get properties() { return {
        "el": {
            "elementRef": true
        },
        "height": {
            "type": String,
            "attr": "height"
        },
        "width": {
            "type": String,
            "attr": "width"
        }
    }; }
    static get style() { return "/**style-placeholder:event-timeline:**/"; }
}
