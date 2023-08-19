const dataFeed = require('./dataFeed.json');
const testProcess = require('./process.js');

const EsimdMatrix = require('./esimd-matrix.js');

describe('ESIMD Matrix', () => {
  test('will permute a matrix of data', async () => {
    const esimdProcess = EsimdMatrix.esimd(testProcess.process);
    expect.assertions(3);

    const result = await esimdProcess(...dataFeed);
    expect(result.length).toBe(24);
    expect(result[0]).toBe('ACF');
    expect(result[23]).toBe('BE2');
  });

  test('returns undefined when errors occur', async () => {
    const testData = [
      ['6', 'A'],
      ['B', '6', 'C'],
      ['D', 'E', '6', 'F'],
    ];
    const esimdProcess = EsimdMatrix.esimd(testProcess.process);
    expect.assertions(4);

    const result = await esimdProcess(...testData);
    expect(result.length).toBe(24);
    expect(result[0]).toBe('6BD');
    expect(result[6]).not.toBeDefined();
    expect(result[23]).toBe('ACF');
  });
});
