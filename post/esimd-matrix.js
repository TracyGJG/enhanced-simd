function esimd(instruction) {
  return async function (...dataSources) {
    const executions = permute(instruction, structuredClone(dataSources));
    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

function permute(fn, dataFeeds) {
  const dataFeedLength = dataFeeds.length;
  return _permute().flat(dataFeedLength - 1);

  function _permute(...buffers) {
    const buffersLength = buffers.length;
    return buffersLength === dataFeedLength
      ? executeInstruction(fn)(buffers)
      : dataFeeds[buffersLength].map((dataFeed) =>
          _permute(...buffers, dataFeed)
        );
  }
}

function executeInstruction(fnInstruction) {
  return (dataset) =>
    new Promise(async (resolve, reject) => {
      try {
        resolve(await fnInstruction(...dataset));
      } catch (error) {
        reject(error);
      }
    });
}

exports.esimd = esimd;
