const getDisplayTime = (num: number): string => {
  return num === 0 ? '00' :
    (num > 0 && num < 10) ? `0${num}` : `${num}`;
};

export const getTime = (min: number, sec: number): string => {
  return `${getDisplayTime(min)}:${getDisplayTime(sec)}`;
};
