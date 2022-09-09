export interface IInsertValuesPlaceholderParams {
  count: number;
  perGroup: number;
  startingFrom?: number;
}

export const getInsertValuesPlaceholder = ({ count, perGroup, startingFrom = 1 }: IInsertValuesPlaceholderParams) =>
  Array.from({ length: count }, (_v, groupIdx) => {
    const groupShift = startingFrom + groupIdx * perGroup;
    const groupPlaceholders = Array.from({ length: perGroup }, (_v, idx) => `$${groupShift + idx}`);
    return `(${groupPlaceholders.join(', ')})`;
  }).join(', ');
