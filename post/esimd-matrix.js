const { permute } = require('../src/supportingFunctions.js');

function esimd(instruction) {
  let dataFeeds;

  return async function (...dataSources) {
    dataFeeds = structuredClone(dataSources);

    const executions = permute(instruction, dataFeeds);

    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

exports.esimd = esimd;
