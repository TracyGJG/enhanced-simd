const ExecutionMode = {
  NO_CACHE: 0,
  CACHED: 1,
  MATRIX: 2,
};

function ess(
  instruction, 
  executionMode = ExecutionMode.NO_CACHE
) {
  let caches = [...Array(instruction.length)].fill([]);

  return async function (...dataSources) {
    let dataFeeds = (executionMode === ExecutionMode.CACHED)
      ? caches.map((cache, index) => [...cache, ...structuredClone(dataSources[index])])
      : structuredClone(dataSources);
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
      return (buffers) => new Promise((resolve, reject) => {
        try {
          resolve(fnInstruction(...buffers));
        } catch (error) {
          reject(error);
        }
      })
    }
  }
}

exports.ess = ess;
exports.ExecutionMode = ExecutionMode;
