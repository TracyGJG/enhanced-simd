function esimd(
  instruction
) {
  let caches = [...Array(instruction.length)].fill([]);

  return async function (...dataSources) {
    let dataFeeds = caches.map((cache, index) => 
      [...cache, ...structuredClone(dataSources[index])]);
    caches = dataFeeds;

    const executions = transform(instruction, dataFeeds);

    const results = await Promise.allSettled(executions);
    return results.map(result => result.value);
  };

  function transform(fn, axies) {
    const minAxisLength = Math.min(...(axies.map(axis => axis.length)));
    const buffers = axies.map(axis => axis.splice(0, minAxisLength));

    return _transposeArray(buffers).map(
      _executeInstruction(fn)
    );

    function _transposeArray(matrix) {
      return matrix.reduce(
        (_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
        []
      );
    }

    function _executeInstruction(fnInstruction) {
      return (buffers) => new Promise(async (resolve, reject) => {
        try {
          resolve(await fnInstruction(...buffers));
        } catch (error) {
          reject(error);
        }
      })
    }
  }
}

exports.esimd = esimd;
