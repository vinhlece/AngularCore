import { Chance } from 'chance';
var getDateArray = function (start, end) {
    var arr = new Array();
    var dt = new Date(start);
    while (dt <= end) {
        arr.push(new Date(dt));
        let ran = Math.floor(Math.random() * 1000);
        // dt.setDate(dt.getDate() + ran);
        dt = new Date(dt.getTime() + (ran * 1000));
        console.log('getDateArray', dt);
    }
    arr = arr.map(dt => {
        let obj = {};
        obj.date = dt;
        return obj;
    });
    return arr;
};
export function getStartEndDates(startDate, endDate) {
    return getDateArray(startDate, endDate).map(dt => {
        let obj = Object.assign({}, dt);
        obj.startDate = dt;
        obj.endDate = {};
        obj.endDate.date = new Date(obj.startDate.date);
        let ran = Math.floor(Math.random() * 20) + 1;
        //   obj.endDate.date = new Date(obj.endDate.date.setHours(obj.endDate.date.getHours() + ran));
        obj.endDate.date = new Date(obj.endDate.date.setMinutes(obj.endDate.date.getMinutes() + ran));
        return obj;
    });
}
export function getRandomDates(startDate, endDate) {
    return getDateArray(startDate, endDate);
}
export function getRandomData(keys, start, end) {
    let names = [];
    for (let i = 0; i < keys; i++) {
        // names.push(Chance().name());
        names.push(Chance().guid().substring(0, 8));
    }
    const data = names.map(name => {
        let obj = {};
        obj.name = name;
        // obj.data = getRandomDates(start, end);
        obj.data = getStartEndDates(start, end);
        return obj;
    });
    console.log(data);
    return data;
}
