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

    const executions = permute(instruction, dataFeeds);

    const results = await Promise.allSettled(executions);

    if (results.some(result => result.status !== 'fulfilled')) {
      throw Error('ess: Error - Instruction execution failed');
    }
    return results.map(result => result.value);      
  };

  function permute(fn, axies) {
    return _permute().flat(axies.length - 1);

    function _permute(...buffers) {
      return (buffers.length === axies.length)
      ? _executeInstruction(fn, buffers)
      : axies[buffers.length].map(datum => _permute(...buffers, datum));
    }

    function _executeInstruction(fnInstruction, buffers) {
      return  new Promise((resolve, reject) => {
        try {
          resolve(fnInstruction(...buffers));
        } catch (error) {
          reject(error);
        }
      })
    }
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

const essProcess = ess(process, ExecutionMode.MATRIX);

const dataFeed = [
  ['A', 'B'],
  ['C', 'D', 'E'],
  ['F', '0', '1', '2']
];

(async () => {
  console.log(JSON.stringify(await essProcess(...dataFeed), null, 2));
})();
