function unflatten(...specification) {
    return (flatData) => _unflatten(flatData, ...specification);

    function _unflatten(data, splits, ...specs) {
        const splitSize = Math.ceil(data.length / splits);
        const result = [];
        while(splits--) {
            result.push(data.splice(0, splitSize));
        }
        return specs.length ? result.map(sec => _unflatten(sec, ...specs)) : result;
    }
}

const dataFeed = [
    'A', 'C', 'F', 'A', 'C', 'G', 'A', 'C', 'H', 'A', 'C', 'I',
    'A', 'D', 'F', 'A', 'D', 'G', 'A', 'D', 'H', 'A', 'D', 'I',
    'A', 'E', 'F', 'A', 'E', 'G', 'A', 'E', 'H', 'A', 'E', 'I',
    'B', 'C', 'F', 'B', 'C', 'G', 'B', 'C', 'H', 'B', 'C', 'I',
    'B', 'D', 'F', 'B', 'D', 'G', 'B', 'D', 'H', 'B', 'D', 'I',
    'B', 'E', 'F', 'B', 'E', 'G', 'B', 'E', 'H', 'B', 'E', 'I',
];

const structured = unflatten(2, 3, 4)(dataFeed);
console.log(JSON.stringify(structured, null, 2));
console.log(structured.length);
console.log(structured[0].length);
console.log(structured[0][0].length);
