// import * as d3 from 'd3/build/d3';
import * as d3 from 'd3';
import interactionTimeline from '../custom-timeline/lib/index.js';
import { getRandomData } from './util';
export function initTimeline() {
    var startDate = new Date("01/01/2018 09:00:00"); //YYYY-MM-DD
    var endDate = new Date("01/01/2018 18:00:00"); //YYYY-MM-DD
    const chart = interactionTimeline({ d3,
        range: { start: startDate, end: endDate },
        drop: {
            onClick: data => {
                console.log(`Data ${Object.keys(data)} has been clicked!`);
            },
            onMouseOver: data => {
                console.log(this);
                d3.select(this).attr('transfrom', 'scale(3)');
                console.log(`mouseover`, data);
            },
        },
        metaballs: false
    });
    const data = getRandomData(10, startDate, endDate);
    console.log(data);
    d3
        .select('event-timeline > div')
        .data([data])
        .call(chart);
}
