export const splitNumbersIntoGroups = (start: number, end: number, excludedNumbers: number[]): number[][] => {
  const allNumbers = Array.from(
    { length: end - start + 1 }, 
    (_, i) => start + i
  ).filter(num => !excludedNumbers.includes(num));

  const groups: number[][] = [];
  const numbersPerGroup = 20;

  for (let i = 0; i < allNumbers.length; i += numbersPerGroup) {
    groups.push(allNumbers.slice(i, i + numbersPerGroup));
  }

  return groups;
};