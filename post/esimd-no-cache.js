function esimd(instruction) {
  return async function (...dataSources) {
    let dataFeeds = structuredClone(dataSources);
    const minDataFeedLength = Math.min(
      ...dataFeeds.map((dataFeed) => dataFeed.length)
    );
    const buffers = dataFeeds.map((dataFeed) =>
      dataFeed.splice(0, minDataFeedLength)
    );

    const executions = transform(instruction, buffers);
    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

function transform(fn, buffers) {
  const swapRowColumn = (_, row) =>
    row.map((__, i) => [...(_[i] || []), row[i]]);

  return buffers.reduce(swapRowColumn, []).map(executeInstruction(fn));
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
