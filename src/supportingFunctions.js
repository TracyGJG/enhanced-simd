function permute(fn, dataFeeds) {
  const dataFeedLength = dataFeeds.length;
  return _permute().flat(dataFeedLength - 1);

  function _permute(...buffers) {
    const buffersLength = buffers.length;
    return buffersLength === dataFeedLength
      ? executeInstruction(fn)(buffers)
      : dataFeeds[buffersLength].map((dataFeed) =>
          _permute(...buffers, dataFeed)
        );
  }
}

function transform(fn, dataFeeds) {
  const minDataFeedLength = Math.min(
    ...dataFeeds.map((dataFeed) => dataFeed.length)
  );
  const buffers = dataFeeds.map((dataFeed) =>
    dataFeed.splice(0, minDataFeedLength)
  );

  const swapRowColumn = (_, row) =>
    row.map((__, i) => [...(_[i] || []), row[i]]);

  return buffers.reduce(swapRowColumn, []).map(executeInstruction(fn));
}

function executeInstruction(fnInstruction) {
  return (dataset) =>
    new Promise(async (resolve, reject) => {
      try {
        resolve(await fnInstruction(...dataset));
      } catch (error) {
        reject(error);
      }
    });
}

exports.permute = permute;
exports.transform = transform;
