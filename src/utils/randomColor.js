const ranInt = () => {
  return Math.floor(Math.random() * 256);
};

const randomColor = () => {
  const r = ranInt();
  const g = ranInt();
  const b = ranInt();
  return `rgb(${r}, ${g}, ${b})`;
};

export { ranInt };
export default randomColor;
