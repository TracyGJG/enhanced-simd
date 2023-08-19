function esimd(instruction) {
  let caches = [...Array(instruction.length)].fill([]);

  return async function (...dataSources) {
    let dataFeeds = caches.map((cache, index) => [
      ...cache,
      ...structuredClone(dataSources[index]),
    ]);
    caches.length = 0;
    caches.push(...dataFeeds);

    const executions = transform(instruction, dataFeeds);
    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

// function cacheSurplus(cachedData, dataSources) {

// }

function transform(fn, dataFeeds) {
  const minDataFeedLength = Math.min(
    ...dataFeeds.map((dataFeed) => dataFeed.length)
  );
  const buffers = dataFeeds.map((dataFeed) =>
    dataFeed.splice(0, minDataFeedLength)
  );

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
