function esimd(instruction) {
  return async function (...dataSources) {
    let dataFeeds = structuredClone(dataSources);

    const executions = permute(instruction, dataFeeds);

    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}
function permute(fn, axies) {
  return _permute().flat(axies.length - 1);

  function _permute(...buffers) {
    return buffers.length === axies.length
      ? executeInstruction(fn, buffers)
      : axies[buffers.length].map((datum) => _permute(...buffers, datum));
  }
}

function executeInstruction(fnInstruction, buffers) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await fnInstruction(...buffers));
    } catch (error) {
      reject(error);
    }
  });
}

exports.esimd = esimd;
