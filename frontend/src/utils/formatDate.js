const formatDate = (isoString, showTime = false) => {
  const date = new Date(isoString);
  const pad = (n) => n.toString().padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  if (!showTime) {
    return `${day}-${month}-${year}`;
  }
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};
export default formatDate;
