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
    let caches = [...Array(instruction.length)].fill([]);

    return async function (...dataSources) {
        checkAlignment(instruction.length, dataSources);

        let dataFeeds = (executionMode === ExecutionMode.CACHED)
            ? caches.map((cache, index) => [...cache, ...structuredClone(dataSources[index])])
            : structuredClone(dataSources);
        caches = dataFeeds;

        const executions = (executionMode === ExecutionMode.MATRIX
            ? permute : transform)(instruction, dataFeeds);

        const results = await Promise.allSettled(executions);

        validateResults(results);
        return results.map(result => result.value);      
    };
}

function permute(fn, axies) {
    return _permute().flat(axies.length - 1);

    function _permute(...buffers) {
        const buffersLength = buffers.length;
        return ((buffersLength === axies.length)
            ? _executeInstruction(fn, buffers)
            : axies[buffersLength].map(axis => _permute(...buffers, axis)));
    }
}

function transform(fn, axies) {
    return _transpose().map(
        buffer => _executeInstruction(fn, buffer)
    );

    function _transpose() {
        const minAxisLength = Math.min(...(axies.map(axis => axis.length)));
        const buffers = axies.map(axis => axis.splice(0, minAxisLength));
        const swapRowColumn = (_, row) => row.map((__, i) => [...(_[i] || []), row[i]]);
        return buffers.reduce( swapRowColumn, []);
    }
}

function _executeInstruction(fnInstruction, buffers) {
    return  new Promise((resolve, reject) => {
        try {
            resolve(fnInstruction(...buffers));
        } catch (error) {
            reject(error);
        }
    });
}

function checkAlignment(numParams, dataFeeds) {
    if (dataFeeds.length !== numParams) {
        throw Error('ess: Error - Mismatch between the number of data feeds and the parameters of the instruction');
    }
}

function validateResults(executionResults) {
    if (executionResults.some(result => result.status !== 'fulfilled')) {
        throw Error('ess: Error - Instruction execution failed');
    }
}

exports.ess = ess;
exports.ExecutionMode = ExecutionMode;