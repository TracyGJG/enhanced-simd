const { permute, transform } = require('./supportingFunctions.js');

const ExecutionMode = {
  NO_CACHE: 0,
  CACHED: 1,
  MATRIX: 2,
};

function esimd(instruction, executionMode = ExecutionMode.NO_CACHE) {
  const caches =
    executionMode === ExecutionMode.CACHED
      ? [...Array(instruction.length)].map((_) => [])
      : null;
  let dataFeeds;

  return async function (...dataSources) {
    checkAlignment(instruction, dataSources);
    checkCapacity(executionMode, dataSources);

    dataFeeds = structuredClone(dataSources);

    const executions = (
      executionMode === ExecutionMode.MATRIX ? permute : transform
    )(instruction, dataFeeds, caches);

    const results = await Promise.allSettled(executions);
    validateResults(results);
    return results.map((result) => result.value);
  };
}

function checkAlignment(instruction, dataFeeds) {
  if (instruction.length !== dataFeeds.length) {
    throw Error(
      'esimd: Error - Mismatch between the number of data feeds and the parameters of the instruction'
    );
  }
}

function checkCapacity(mode, dataFeeds) {
  const MAX_NUMBER_OF_FEEDS = 10;
  const MAX_SIZE_OF_FEED = 10;
  const MAX_SIZE_OF_MATRIX = 10_000;

  if (mode === ExecutionMode.MATRIX) {
    if (dataFeeds.length > MAX_NUMBER_OF_FEEDS) {
      throw Error(
        `esimd: Error - The number of data feeds exceeds the maximum of ${MAX_NUMBER_OF_FEEDS}.`
      );
    }
    const feedSizes = dataFeeds.map((dataFeed) => dataFeed.length);
    if (Math.max(...feedSizes) > MAX_SIZE_OF_FEED) {
      throw Error(
        `esimd: Error - On or more of the data feeds exceeds the maximum size of ${MAX_SIZE_OF_FEED}.`
      );
    }
    const matrixSize = feedSizes.reduce((total, size) => total * size);
    if (matrixSize > MAX_SIZE_OF_MATRIX) {
      throw Error(
        `esimd: Error - The calculated size of the output matrix exceeds the maximum size of ${MAX_SIZE_OF_MATRIX}.`
      );
    }
  }
}

function validateResults(executionResults) {
  if (executionResults.some((result) => result.status !== 'fulfilled')) {
    throw Error('esimd: Error - Instruction execution failed');
  }
}

exports.esimd = esimd;
exports.ExecutionMode = ExecutionMode;
