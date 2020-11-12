export interface Message {
  key: string;
  value: string;
  partition: number;
  offset: number;
}

const AUTO_OFFSET_RESET_SMALLEST = 'smallest';
const AUTO_OFFSET_RESET_LARGEST = 'largest';
