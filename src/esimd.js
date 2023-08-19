const supportingFunctions = require('./supportingFunctions.js');

const ExecutionMode = {
  NO_CACHE: 0,
  CACHED: 1,
  MATRIX: 2,
};

function esimd(instruction, executionMode = ExecutionMode.NO_CACHE) {
  let caches = [...Array(instruction.length)].fill([]);
  let dataFeeds;

  return async function (...dataSources) {
    const alignmentError = checkAlignment(instruction.length, dataSources);
    if (alignmentError) {
      throw alignmentError;
    }
    const capacityError = checkCapacity(executionMode, dataSources);
    if (capacityError) {
      throw capacityError;
    }

    if (executionMode === ExecutionMode.CACHED) {
      dataFeeds = caches.map((cache, index) => [
        ...cache,
        ...structuredClone(dataSources[index]),
      ]);
      caches = dataFeeds;
    } else {
      dataFeeds = structuredClone(dataSources);
    }

    const executions = (
      executionMode === ExecutionMode.MATRIX
        ? supportingFunctions.permute
        : supportingFunctions.transform
    )(instruction, dataFeeds);

    const results = await Promise.allSettled(executions);
    const valiationError = validateResults(results);
    if (valiationError) {
      throw valiationError;
    }
    return results.map((result) => result.value);
  };
}

function checkAlignment(numParams, dataFeeds) {
  if (dataFeeds.length !== numParams) {
    return Error(
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
      return Error(
        `esimd: Error - The number of data feeds exceeds the maximum of ${MAX_NUMBER_OF_FEEDS}.`
      );
    }
    const feedSizes = dataFeeds.map((dataFeed) => dataFeed.length);
    if (Math.max(...feedSizes) > MAX_SIZE_OF_FEED) {
      return Error(
        `esimd: Error - On or more of the data feeds exceeds the maximum size of ${MAX_SIZE_OF_FEED}.`
      );
    }
    const matrixSize = feedSizes.reduce((total, size) => total * size);
    if (matrixSize > MAX_SIZE_OF_MATRIX) {
      return Error(
        `esimd: Error - The calculated size of the output matrix exceeds the maximum size of ${MAX_SIZE_OF_MATRIX}.`
      );
    }
  }
}

function validateResults(executionResults) {
  if (executionResults.some((result) => result.status !== 'fulfilled')) {
    return Error('esimd: Error - Instruction execution failed');
  }
}

exports.esimd = esimd;
exports.ExecutionMode = ExecutionMode;
