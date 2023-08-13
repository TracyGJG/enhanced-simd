function permute(fn, ...axies) {

    return _permute().flat(axies.length - 1);

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

(() => {
    console.log(JSON.stringify(permute(asyncJoin, ...dataFeed), null, 2));
})();