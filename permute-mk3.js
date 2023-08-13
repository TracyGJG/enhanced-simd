async function permute(fn, ...axies) {

    return (await Promise.allSettled(_permute().flat(axies.length - 1))).map(_ => _.value);

    function _permute(...indicies) {
        return (indicies.length === axies.length)
        ? fn(indicies)
        : axies[indicies.length].map(datum => _permute(...indicies, datum))
        ;
    }
}

const dataFeed = [
    ['A', 'B'],
    ['C', 'D', 'E'],
    ['F', 'G', 'H', 'I']
];

function asyncJoin(data) {
    return data.join('');
}

// (() => {
//     console.log(JSON.stringify(permute(asyncJoin, ...dataFeed), null, 2));
// })();

(async () => {
    console.log(JSON.stringify(await permute(asyncJoin, ...dataFeed), null, 2));
    // console.table(await test(...dataFeed));
})();
