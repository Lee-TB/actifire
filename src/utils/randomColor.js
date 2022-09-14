const ranInt = (start = 0, end = 0) => {
  if (end < start) return -1;
  return Math.floor(start + Math.random() * (end - start));
};

const randomColor = (ranIntCallback) => {
  const r = ranIntCallback();
  const g = ranIntCallback();
  const b = ranIntCallback();
  return `rgb(${r}, ${g}, ${b})`;
};

export { ranInt };
export default randomColor;
