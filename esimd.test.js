const Esimd = require('./esimd.js');

const testData = {
    empty: [[],[],[]],
    populated: [
        ['A', 'B'],
        ['C', 'D', 'E'],
        ['F', '0', '1', '2']
    ]
};

function process(a,b,c) {
    const result = `${a}${b}${c}`;
    if (result.trim().length === 3) {
        return result;
    }
    throw Error('Process fault');
}

describe('Esimd', () => {
    describe('Properties', () => {
        test('has an ExecutionMode enumeration', () => {
            expect(Esimd.ExecutionMode).toBeDefined();
            expect(typeof Esimd.ExecutionMode).toBe('object');
            expect(Esimd.ExecutionMode.NO_CACHE).toBe(0);
            expect(Esimd.ExecutionMode.CACHED).toBe(1);
            expect(Esimd.ExecutionMode.MATRIX).toBe(2);
        });

        test('has an ess method', () => {
            expect(Esimd.ess).toBeDefined();
            expect(typeof Esimd.ess).toBe('function');
        });
    });

    describe('No Cache operations', () => {
        let essInstruction;

        beforeEach(() => {
            essInstruction = Esimd.ess(process);
        });

        test('with three empty arrays', async () => {
            const result = await essInstruction(...testData.empty);
            expect(result.length).toBe(0);
        });

        test('with three populated arrays', async () => {
            const result = await essInstruction(...testData.populated);
            expect(result.length).toBe(2);
            expect(result[0]).toBe('ACF');
            expect(result[1]).toBe('BD0');
        });

        test('with three populated arrays (without caching)', async () => {
            let result = await essInstruction(...testData.populated);
            expect(result.length).toBe(2);
            expect(result[0]).toBe('ACF');
            expect(result[1]).toBe('BD0');

            const reversedTestData = structuredClone(testData.populated).reverse();
            result = await essInstruction(...reversedTestData);
            expect(result.length).toBe(2);
            expect(result[0]).toBe('FCA');
            expect(result[1]).toBe('0DB');
        });

        test('with a mismatched input', async () => {
            const exceptionTest = () => essInstruction([], []);
            expect(exceptionTest).rejects.toThrow('ess: Error - Mismatch between the number of data feeds and the parameters of the instruction');
        });

        test('with a failed execution', async () => {
            const exceptionTest = () => essInstruction(['a', 'b'], ['c', 'd'], ['e', ' ']);
            expect(exceptionTest).rejects.toThrow('ess: Error - Instruction execution failed');
        });
    });

    describe('Cached operations', () => {
        let essInstruction;

        beforeEach(() => {
            essInstruction = Esimd.ess(process, Esimd.ExecutionMode.CACHED);
        });

        test('with three empty arrays', async () => {
            const result = await essInstruction(...testData.empty);
            expect(result.length).toBe(0);
        });

        test('with three populated arrays', async () => {
            const result = await essInstruction(...testData.populated);
            expect(result.length).toBe(2);
            expect(result[0]).toBe('ACF');
            expect(result[1]).toBe('BD0');
        });

        test('with three populated arrays (without caching)', async () => {
            let result = await essInstruction(...testData.populated);
            expect(result.length).toBe(2);
            expect(result[0]).toBe('ACF');
            expect(result[1]).toBe('BD0');

            const reversedTestData = structuredClone(testData.populated).reverse();
            result = await essInstruction(...reversedTestData);
            expect(result.length).toBe(4);
            expect(result[0]).toBe('FE1');
            expect(result[1]).toBe('0C2');
            expect(result[2]).toBe('1DA');
            expect(result[3]).toBe('2EB');
        });
    });

    describe('Matrix operations', () => {
        let essInstruction;

        beforeEach(() => {
            essInstruction = Esimd.ess(process, Esimd.ExecutionMode.MATRIX);
        });

        test('with three empty arrays', async () => {
            const result = await essInstruction(...testData.empty);
            expect(result.length).toBe(0);
        });

        test('with three populated arrays', async () => {
            const result = await essInstruction(...testData.populated);
            expect(result.length).toBe(24);
            expect(result[0]).toBe('ACF');
            expect(result[1]).toBe('AC0');
            expect(result[23]).toBe('BE2');
        });
    });
});
