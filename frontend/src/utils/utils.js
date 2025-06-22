export const stringToJsonParser = (data) => {
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};
