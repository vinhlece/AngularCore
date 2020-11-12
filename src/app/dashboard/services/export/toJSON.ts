import {getMomentByTimestamp} from '../../../common/services/timeUtils';
import {AppDateTimeFormat} from '../../../common/models/enums';
import * as _ from 'lodash';
import {isNullOrUndefined} from 'util';
import {Agent, Queue, Region} from '../../../common/models/constants';

export const toJSON = (data: any) => {
  const dataToExport = [];
  data.data.forEach((item) => {
    const obj = {};
    _.keys(item).forEach(key => {
      if (key === 'Id' || key === 'AutoInvokeUrls') {
        return;
      }

      if (key === Agent || key === Queue || key === Region) {
        if (!isNullOrUndefined(item[key].primary.value)) {
          obj[key] = item[key].primary.value;
        }
        return;
      }

      if (key === 'MeasureTimestamp') {
        obj[key] = getMomentByTimestamp(item.timestamp).format(AppDateTimeFormat.dateTime);
      } else {
        if (isNullOrUndefined(item[key].primary)) {
          console.log(key)
        }
        obj[key] = item[key].secondary ?
          `${item[key].primary.value} (${item[key].secondary.value})` :
          item[key].primary.value;
      }
    });
    dataToExport.push(obj);
  });
  return dataToExport;
};
