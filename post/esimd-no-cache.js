function esimd(
  instruction
) {

  return async function (...dataSources) {
    let dataFeeds = structuredClone(dataSources);

    const dataFeedLengths = dataFeeds.map(dataFeed => dataFeed.length);
    const minDataFeedLength = Math.min(...dataFeedLengths);
    const buffers = dataFeeds.map(dataFeed => dataFeed.splice(0, minDataFeedLength));

    const executions = transposeArray(buffers).map(
      _executeInstruction(instruction)
    );
    const results = await Promise.allSettled(executions);
    return results.map(result => result.value);
  };

  function transposeArray(matrix) {
    return matrix.reduce(
      (_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
      []
    );
  }

  function _executeInstruction(fnInstruction) {
    return (dataset) => new Promise((resolve, reject) => {
      try {
        resolve(fnInstruction(...dataset));
      } catch (error) {
        reject(error);
      }
    });
  }
}

exports.esimd = esimd;