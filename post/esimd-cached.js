const { transform } = require('../src/supportingFunctions.js');

function esimd(instruction) {
  let caches = [...Array(instruction.length)].map((_) => []);
  let dataFeeds;

  return async function (...dataSources) {
    dataFeeds = structuredClone(dataSources);

    const executions = transform(instruction, dataFeeds, caches);

    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

exports.esimd = esimd;
