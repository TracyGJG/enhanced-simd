const dataFeed = require('./dataFeed.json');
const testProcess = require('./process.js');

const EsimdCached = require('./esimd-cached.js');

describe('ESIMD Cached', () => {
    let essProcess;

    beforeEach(() => {
        essProcess = EsimdCached.ess(testProcess.process, EsimdCached.ExecutionMode.CACHED);
    });

    test("will cache extra data", async () => {
      expect.assertions(8);

      const firstPass = await essProcess(...dataFeed);
      expect(firstPass.length).toBe(2);
      expect(firstPass[0]).toStrictEqual('ACF');
      expect(firstPass[1]).toStrictEqual('BD0');

      const secondPass = await essProcess(...dataFeed.reverse());
      expect(secondPass.length).toBe(4);
      expect(secondPass[0]).toStrictEqual('FE1');
      expect(secondPass[1]).toStrictEqual('0C2');
      expect(secondPass[2]).toStrictEqual('1DA');
      expect(secondPass[3]).toStrictEqual('2EB');
    });
});