export const stringToJsonParser = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    // console.error('Error parsing data:', error);
    return [];
  }
};
