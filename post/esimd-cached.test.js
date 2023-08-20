const dataFeed = require('./dataFeed.json');
const testProcess = require('./process.js');

const EsimdCached = require('./esimd-cached.js');

describe('ESIMD Cached', () => {
  test('will cache extra data', async () => {
    const esimdProcess = EsimdCached.esimd(testProcess.process);
    expect.assertions(11);

    const firstPass = await esimdProcess(...dataFeed);
    expect(firstPass.length).toBe(2);
    expect(firstPass[0]).toStrictEqual('ACF');
    expect(firstPass[1]).toStrictEqual('BD0');

    const secondPass = await esimdProcess(...dataFeed.reverse());
    expect(secondPass.length).toBe(4);
    expect(secondPass[0]).toStrictEqual('FE1');
    expect(secondPass[1]).toStrictEqual('0C2');
    expect(secondPass[2]).toStrictEqual('1DA');
    expect(secondPass[3]).toStrictEqual('2EB');

    const thirdPass = await esimdProcess(...dataFeed);
    expect(thirdPass.length).toBe(2);
    expect(thirdPass[0]).toStrictEqual('FCA');
    expect(thirdPass[1]).toStrictEqual('0DB');
  });

  test('returns undefined when errors occur', async () => {
    const testData = [
      ['A', 'B'],
      ['C', 'D', '6'],
      ['6', 'E', '6', 'F'],
    ];
    const esimdProcess = EsimdCached.esimd(testProcess.process);
    expect.assertions(8);

    const firstPass = await esimdProcess(...testData);
    expect(firstPass.length).toBe(2);
    expect(firstPass[0]).toStrictEqual('AC6');
    expect(firstPass[1]).toStrictEqual('BDE');

    const secondPass = await esimdProcess(...testData.reverse());
    expect(secondPass.length).toBe(4);
    expect(secondPass[0]).not.toBeDefined();
    expect(secondPass[1]).toStrictEqual('ECF');
    expect(secondPass[2]).toStrictEqual('6DA');
    expect(secondPass[3]).toStrictEqual('F6B');
  });
});
