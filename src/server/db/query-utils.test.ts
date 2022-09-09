import { getInsertValuesPlaceholder } from '@app/server/db/query-utils';

describe('getInsertValuesPlaceholder', () => {
  it('should generate single group', function () {
    const placeholder = getInsertValuesPlaceholder({ count: 1, perGroup: 3 });
    expect(placeholder).toEqual('($1, $2, $3)');
  });

  it('should generate multiple groups', function () {
    const placeholder = getInsertValuesPlaceholder({ count: 3, perGroup: 3 });
    expect(placeholder).toEqual('($1, $2, $3), ($4, $5, $6), ($7, $8, $9)');
  });

  it('should generate with shift', function () {
    const placeholder = getInsertValuesPlaceholder({ count: 3, perGroup: 3, startingFrom: 7 });
    expect(placeholder).toEqual('($7, $8, $9), ($10, $11, $12), ($13, $14, $15)');
  });
});
