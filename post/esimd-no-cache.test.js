const dataFeed = require('./dataFeed.json');
const testProcess = require('./process.js');

const EsimdNoCache = require('./esimd-no-cache.js');

describe('ESIMD No Cache', () => {
  test('does not cache extra data', async () => {
    const esimdProcess = EsimdNoCache.esimd(testProcess.process);
    expect.assertions(6);

    const firstPass = await esimdProcess(...dataFeed);
    expect(firstPass.length).toBe(2);
    expect(firstPass[0]).toStrictEqual('ACF');
    expect(firstPass[1]).toStrictEqual('BD0');

    const secondPass = await esimdProcess(...dataFeed.reverse());
    expect(secondPass.length).toBe(2);
    expect(secondPass[0]).toStrictEqual('FCA');
    expect(secondPass[1]).toStrictEqual('0DB');
  });

  test('returns undefined when errors occur', async () => {
    const testData = [
      ['A', '6', 'B'],
      ['C', '6', 'D', 'E'],
      ['F', '6', '0', '1', '2'],
    ];
    const esimdProcess = EsimdNoCache.esimd(testProcess.process);
    expect.assertions(4);

    const firstPass = await esimdProcess(...testData);
    expect(firstPass.length).toBe(3);
    expect(firstPass[0]).toStrictEqual('ACF');
    expect(firstPass[1]).not.toBeDefined();
    expect(firstPass[2]).toStrictEqual('BD0');
  });
});
