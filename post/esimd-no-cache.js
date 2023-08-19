const supportingFunctions = require('../supportingFunctions.js');

function esimd(instruction) {
  return async function (...dataSources) {
    const executions = supportingFunctions.transform(
      instruction,
      structuredClone(dataSources)
    );
    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

exports.esimd = esimd;
