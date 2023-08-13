// export 
const ExecutionMode = {
  NO_CACHE: 0,
  CACHED: 1,
  MATRIX: 2,
};

// export default 
function ess(
  instruction, 
  executionMode = ExecutionMode.NO_CACHE
) {
  // let caches = [...Array(instruction.length)].fill([]);

  return async function (...dataSources) {
    checkAlignment(dataSources);

    let dataFeeds = 
    // (executionMode === ExecutionMode.CACHED)
      // ? caches.map((cache, index) => [...cache, ...structuredClone(dataSources[index])])
      // : 
      structuredClone(dataSources);
    // caches = dataFeeds;

    const dataFeedLengths = dataFeeds.map(dataFeed => dataFeed.length);
    const minDataFeedLength = Math.min(...dataFeedLengths);
    const buffers = dataFeeds.map(dataFeed => dataFeed.splice(0, minDataFeedLength));

    const executions = transposeArray(buffers).map(
      buffer =>
      new Promise((resolve, reject) => {
        try {
          resolve(instruction(...buffer));
        } catch (error) {
          reject(error);
        }
      })
    );
    const results = await Promise.allSettled(executions);

    if (results.some(result => result.status !== 'fulfilled')) {
      throw Error('ess: Error - Instruction execution failed');
    }
    return results.map(result => result.value);
  };

  function transposeArray(matrix) {
    return matrix.reduce(
      (_, row) => row.map((__, i) => [...(_[i] || []), row[i]]),
      []
    );
  }

  function checkAlignment(dataFeeds) {
    if (dataFeeds.length !== instruction.length) {
      throw Error('ess: Error - Mismatch between the number of data feeds and the parameters of the instruction')
    }
  }
}

async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function process(a,b,c) {
  const hexValue = `${a}${b}${c}`;
  const decValue = parseInt(hexValue, 16);
  const result = `${hexValue} = ${decValue}`;
  console.log(result);
  await sleep(decValue);
  console.log(result);
  return result;
}

const dataFeed = [
  ['A', 'B'],
  ['C', 'D', 'E'],
  ['F', '0', '1', '2']
];

const essProcess = ess(process);

(async () => {
  console.table(await essProcess(...dataFeed));
  console.table(await essProcess(...dataFeed.reverse()));
})();
