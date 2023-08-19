function esimd(instruction) {
  return async function (...dataSources) {
    let dataFeeds = structuredClone(dataSources);

    const dataFeedLengths = dataFeeds.map((dataFeed) => dataFeed.length);
    const minDataFeedLength = Math.min(...dataFeedLengths);
    const buffers = dataFeeds.map((dataFeed) =>
      dataFeed.splice(0, minDataFeedLength)
    );

    const executions = transform(instruction, buffers);
    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

function transform(fn, buffers) {
  return _transposeArray(buffers).map(executeInstruction(fn));

  function _transposeArray(matrix) {
    return matrix.reduce(
      (_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
      []
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
