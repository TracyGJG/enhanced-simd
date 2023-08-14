const dataFeed = require('./dataFeed.json');
const testProcess = require('./process.js');

const EsimdNoCache = require('./esimd-no-cache.js');

describe('ESIMD No Cache', () => {
    let essProcess;

    beforeEach(() => {
        essProcess = EsimdNoCache.ess(testProcess.process);
    });

    test("does not cache extra data", async () => {
        expect.assertions(6);

        const firstPass = await essProcess(...dataFeed);
        expect(firstPass.length).toBe(2);
        expect(firstPass[0]).toStrictEqual('ACF');
        expect(firstPass[1]).toStrictEqual('BD0');

        const secondPass = await essProcess(...dataFeed.reverse());
        expect(secondPass.length).toBe(2);
        expect(secondPass[0]).toStrictEqual('FCA');
        expect(secondPass[1]).toStrictEqual('0DB');
    });
});