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

function transform(fn, dataSources, caches) {
  const swapRowColumn = (_, row) =>
    row.map((__, i) => [...(_[i] || []), row[i]]);

  return cacheSurplus(caches, dataSources)
    .reduce(swapRowColumn, [])
    .map(executeInstruction(fn));
}

function cacheSurplus(caches, dataFeeds) {
  const dataFeedSize = dataFeeds.reduce((feedSize, dataFeed, index) => {
    if (caches) dataFeed.unshift(...caches[index]);
    return Math.min(feedSize, dataFeed.length);
  }, Infinity);

  const newCache = dataFeeds.map((dataFeed) => dataFeed.splice(dataFeedSize));

  if (caches) {
    caches.length = 0;
    caches.push(...newCache);
  }
  return dataFeeds;
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
