const ExecutionMode = {
  NO_CACHE: 0,
  CACHED: 1,
  MATRIX: 2,
};

function esimd(
  instruction, 
  _executionMode = ExecutionMode.NO_CACHE
) {
  return async function (...dataSources) {
    let dataFeeds = structuredClone(dataSources);

    const executions = permute(instruction, dataFeeds);

    const results = await Promise.allSettled(executions);
    return results.map(result => result.value);      
  };

  function permute(fn, axies) {
    return _permute().flat(axies.length - 1);

    function _permute(...buffers) {
      return (buffers.length === axies.length)
      ? _executeInstruction(fn, buffers)
      : axies[buffers.length].map(datum => _permute(...buffers, datum));
    }

    function _executeInstruction(fnInstruction, buffers) {
      return  new Promise((resolve, reject) => {
        try {
          resolve(fnInstruction(...buffers));
        } catch (error) {
          reject(error);
        }
      })
    }
  }
}

exports.esimd = esimd;
exports.ExecutionMode = ExecutionMode;
