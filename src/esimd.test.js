const Esimd = require('./esimd.js');

const testData = {
  empty: [[], [], []],
  populated: [
    ['A', 'B'],
    ['C', 'D', 'E'],
    ['F', '0', '1', '2'],
  ],
};

function process(a, b, c) {
  const result = `${a}${b}${c}`;
  if (result.trim().length === 3) {
    return result;
  }
  throw Error('Process fault');
}

describe('Esimd', () => {
  describe('Properties', () => {
    test('has an ExecutionMode enumeration', () => {
      expect(Esimd.ExecutionMode).toBeDefined();
      expect(typeof Esimd.ExecutionMode).toBe('object');
      expect(Esimd.ExecutionMode.NO_CACHE).toBe(0);
      expect(Esimd.ExecutionMode.CACHED).toBe(1);
      expect(Esimd.ExecutionMode.MATRIX).toBe(2);
    });

    test('has an esimd method', () => {
      expect(Esimd.esimd).toBeDefined();
      expect(typeof Esimd.esimd).toBe('function');
    });
  });

  describe('No Cache operations', () => {
    let esimdInstruction;

    beforeEach(() => {
      esimdInstruction = Esimd.esimd(process);
    });

    test('with three empty arrays', async () => {
      const result = await esimdInstruction(...testData.empty);
      expect(result.length).toBe(0);
    });

    test('with three populated arrays', async () => {
      expect.assertions(3);

      const result = await esimdInstruction(...testData.populated);
      expect(result.length).toBe(2);
      expect(result[0]).toBe('ACF');
      expect(result[1]).toBe('BD0');
    });

    test('with three populated arrays (without caching)', async () => {
      expect.assertions(6);

      let result = await esimdInstruction(...testData.populated);
      expect(result.length).toBe(2);
      expect(result[0]).toBe('ACF');
      expect(result[1]).toBe('BD0');

      const reversedTestData = structuredClone(testData.populated).reverse();
      result = await esimdInstruction(...reversedTestData);
      expect(result.length).toBe(2);
      expect(result[0]).toBe('FCA');
      expect(result[1]).toBe('0DB');
    });

    test('reports an exception when supplied a mismatched input', async () => {
      const exceptionTest = () => esimdInstruction([], []);
      expect(exceptionTest).rejects.toThrow(
        'esimd: Error - Mismatch between the number of data feeds and the parameters of the instruction'
      );
    });

    test('reports an exception when an execution fails', async () => {
      const exceptionTest = () =>
        esimdInstruction(['a', 'b'], ['c', 'd'], ['e', ' ']);
      expect(exceptionTest).rejects.toThrow(
        'esimd: Error - Instruction execution failed'
      );
    });
  });

  describe('Cached operations', () => {
    let esimdInstruction;

    beforeEach(() => {
      esimdInstruction = Esimd.esimd(process, Esimd.ExecutionMode.CACHED);
    });

    test('with three empty arrays', async () => {
      const result = await esimdInstruction(...testData.empty);
      expect(result.length).toBe(0);
    });

    test('with three populated arrays (without caching)', async () => {
      expect.assertions(3);

      const result = await esimdInstruction(...testData.populated);
      expect(result.length).toBe(2);
      expect(result[0]).toBe('ACF');
      expect(result[1]).toBe('BD0');
    });

    test('with three populated arrays (with caching)', async () => {
      expect.assertions(11);

      let result = await esimdInstruction(...testData.populated);
      expect(result.length).toBe(2);
      expect(result[0]).toBe('ACF');
      expect(result[1]).toBe('BD0');

      const reversedTestData = structuredClone(testData.populated).reverse();
      result = await esimdInstruction(...reversedTestData);
      expect(result.length).toBe(4);
      expect(result[0]).toBe('FE1');
      expect(result[1]).toBe('0C2');
      expect(result[2]).toBe('1DA');
      expect(result[3]).toBe('2EB');

      result = await esimdInstruction(...reversedTestData);
      expect(result.length).toBe(2);
      expect(result[0]).toBe('FCA');
      expect(result[1]).toBe('0DB');
    });
  });

  describe('Matrix operations', () => {
    let esimdInstruction;

    beforeEach(() => {
      esimdInstruction = Esimd.esimd(process, Esimd.ExecutionMode.MATRIX);
    });

    test('with three empty arrays', async () => {
      const result = await esimdInstruction(...testData.empty);
      expect(result.length).toBe(0);
    });

    test('with three populated arrays', async () => {
      expect.assertions(4);

      const result = await esimdInstruction(...testData.populated);
      expect(result.length).toBe(24);
      expect(result[0]).toBe('ACF');
      expect(result[1]).toBe('AC0');
      expect(result[23]).toBe('BE2');
    });

    test('reports an exception when too many data feeds are supplied for a matrix', () => {
      const instruction = (_a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k) => '';
      const esimdInstruction2 = Esimd.esimd(
        instruction,
        Esimd.ExecutionMode.MATRIX
      );
      const args = [
        ['A', 'B'],
        ['C', 'D'],
        ['E', 'F'],
        ['G', 'H'],
        ['I', 'J'],
        ['K', 'L'],
        ['M', 'N'],
        ['O', 'P'],
        ['Q', 'R'],
        ['S', 'T'],
        ['U', 'V'],
      ];

      const exceptionTest = async () => await esimdInstruction2(...args);

      expect(exceptionTest).rejects.toThrow(
        'esimd: Error - The number of data feeds exceeds the maximum of 10.'
      );
    });

    test('reports an exception when a data feed is too large', () => {
      expect(async () => {
        await esimdInstruction(
          ['A', 'B'],
          ['C', 'D'],
          ['E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
        );
      }).rejects.toThrow(
        'esimd: Error - On or more of the data feeds exceeds the maximum size of 10.'
      );
    });

    test('reports an exception when the calculated size of the resultant matrix is too large', () => {
      const instruction = (_a, _b, _c, _d, _e) => '';
      const esimdInstruction2 = Esimd.esimd(
        instruction,
        Esimd.ExecutionMode.MATRIX
      );
      const args = [
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        ['K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T'],
        ['U', 'V'],
      ];

      const exceptionTest = async () => await esimdInstruction2(...args);

      expect(exceptionTest).rejects.toThrow(
        'esimd: Error - The calculated size of the output matrix exceeds the maximum size of 10000.'
      );
    });
  });
});
