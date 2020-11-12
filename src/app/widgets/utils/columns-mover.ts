import {MoveColumnEvent} from '../../charts/models';
import {Column, TabularWidget} from '../models';

export function moveColumn(widget: TabularWidget, event: MoveColumnEvent): TabularWidget {
  const columns = widget.columns;

  const {targetColumn, siblingColumn} = event;
  const orderedColumns = event.siblingColumn ? moveBeforeSibling(widget, targetColumn, siblingColumn) : moveToLast(widget, targetColumn);

  return {...widget, columns: orderedColumns};
}


function moveBeforeSibling(widget: TabularWidget, targetColumn: Column, siblingColumn: Column): Column[] {
  const columns = widget.columns;

  return columns.reduce((accumulator: Column[], currentColumn) => {
    if (currentColumn.id === targetColumn.id) {
      return accumulator;
    }

    if (currentColumn.id === siblingColumn.id) {
      accumulator.push(targetColumn);
    }

    accumulator.push(currentColumn);

    return accumulator;
  }, []);
}

function moveToLast(widget: TabularWidget, targetColumn: Column): Column[] {
  const columns = widget.columns;
  const targetColumnIndex = columns.findIndex((column: Column) => column.id === targetColumn.id);
  return [
    ...columns.slice(0, targetColumnIndex),
    ...columns.slice(targetColumnIndex + 1),
    targetColumn
  ];
}
