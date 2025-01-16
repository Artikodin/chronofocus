export const easeInCubic = (x: number): number => {
  return x * x * x;
};

export const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};
