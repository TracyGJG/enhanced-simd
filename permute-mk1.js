function permute(...axies) {

    return _permute();

    function _permute(...indicies) {
        return (indicies.length === axies.length)
        ? indicies
        : axies[indicies.length].map(datum => _permute(...indicies, datum))
        ;
    }
}

const dataFeed = [
    ['A', 'B'],
    ['C', 'D', 'E'],
    ['F', 'G', 'H', 'I']
];

(() => {
    console.log(JSON.stringify(permute(...dataFeed), null, 2));
})();