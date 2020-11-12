export interface Comparable<T> {
  compareWith(item: T): number;
}

export interface QueryItem {
  $in?: any; // in
  $eq?: any; // equal
  $lt?: any; // less than
  $gt?: any; // great than
  $lte?: any; // less than OR equal
  $gte?: any; // great than OR equal
  $contain?: any; // contain
  $notIn?: any; // notIn
}
