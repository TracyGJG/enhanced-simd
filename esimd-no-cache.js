function ess(
  instruction
) {

  return async function (...dataSources) {
    let dataFeeds = structuredClone(dataSources);

    const dataFeedLengths = dataFeeds.map(dataFeed => dataFeed.length);
    const minDataFeedLength = Math.min(...dataFeedLengths);
    const buffers = dataFeeds.map(dataFeed => dataFeed.splice(0, minDataFeedLength));

    const executions = transposeArray(buffers).map(
      buffer =>
      new Promise((resolve, reject) => {
        try {
          resolve(instruction(...buffer));
        } catch (error) {
          reject(error);
        }
      })
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
}

exports.ess = ess;