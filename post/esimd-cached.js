const supportingFunctions = require('../src/supportingFunctions.js');

function esimd(instruction) {
  let caches = [...Array(instruction.length)].fill([]);
  let dataFeeds;

  return async function (...dataSources) {
    dataFeeds = caches.map((cache, index) => [
      ...cache,
      ...structuredClone(dataSources[index]),
    ]);
    caches.length = 0;
    caches.push(...dataFeeds);

    const executions = supportingFunctions.transform(instruction, dataFeeds);
    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

exports.esimd = esimd;
