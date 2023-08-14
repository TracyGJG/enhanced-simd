const dataFeed = require('./dataFeed.json');
const testProcess = require('./process.js');

const EsimdMatrix = require('./esimd-matrix.js');

describe('ESIMD Matrix', () => {
    let essProcess;

    beforeEach(() => {
        essProcess = EsimdMatrix.ess(testProcess.process, EsimdMatrix.ExecutionMode.MATRIX);
    });

    test("will permute a matrix of data", async () => {
      expect.assertions(3);

      const result = await essProcess(...dataFeed);
      expect(result.length).toBe(24);
      expect(result[0]).toBe('ACF');
      expect(result[23]).toBe('BE2');
    });
});