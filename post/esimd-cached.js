const { transform } = require('../src/supportingFunctions.js');

function esimd(instruction) {
  let caches = [...Array(instruction.length)].map((_) => []);

  return async function (...dataSources) {
    const executions = transform(
      instruction,
      structuredClone(dataSources),
      caches
    );

    const results = await Promise.allSettled(executions);
    return results.map((result) => result.value);
  };
}

exports.esimd = esimd;
