import { stringToJsonParser } from './utils';

// calculate average memory
export const calculateAverageMemory = (memoryData = []) => {
  // console.log(memoryData);
  const memoryArray = stringToJsonParser(memoryData)?.map((m) => parseFloat(m.split(' ')[0]));
  if (memoryArray?.length === 0) return 0;
  return memoryArray?.reduce((acc, curr) => acc + curr, 0) / memoryArray?.length;
};

// calculate average runtime
export const calculateAverageTime = (timeData = []) => {
  // console.log(timeData);
  const timeArray = stringToJsonParser(timeData)?.map((t) => parseFloat(t.split(' ')[0]));
  if (timeArray?.length === 0) return 0;
  return timeArray?.reduce((acc, curr) => acc + curr, 0) / timeArray?.length;
};
