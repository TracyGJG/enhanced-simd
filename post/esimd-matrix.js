const supportingFunctions = require('../src/supportingFunctions.js');

function esimd(instruction) {
  return async function (...dataSources) {
    const executions = supportingFunctions.permute(
      instruction,
      structuredClone(dataSources)
    );
    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

exports.esimd = esimd;
