import { stringToJsonParser } from "./utils";

export const calculateAverageMemory = (memoryData = []) => {
  const memoryArray = stringToJsonParser(memoryData)?.map((m) => parseFloat(m.split(' ')[0]));
  if (memoryArray?.length === 0) return 0;
  return memoryArray?.reduce((acc, curr) => acc + curr, 0) / memoryArray?.length;
};


export const calculateAverageTime = (timeData = []) => {
  const timeArray = stringToJsonParser(timeData)?.map((t) => parseFloat(t.split(' ')[0]));
  if (timeArray?.length === 0) return 0;
  return timeArray?.reduce((acc, curr) => acc + curr, 0) / timeArray?.length;
};