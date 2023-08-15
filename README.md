# enhanced-simd (esimd)
Enhancement of the [simulated SIMD](https://github.com/TracyGJG/sim-simd) project, as documented in this [Dev.To]() post to support multiple data sources.

In the original post, the simd function accepted an instruction (function) argument on first call and returned a simd enabled function (simd-instruction) in respose. The simd-instruction expected to be called with an array of data object it would pass to the original instruction, like an `Array.map` method but wrappend in a `Promise` to enable near-parallel execution.

The enhanced edition (esimd) similarly, accepts an instruction and return a simd-enabled version. However, the new function expects to be passed multiple data sources (arrays) and (optionally) an indication on how to manage them (no-cache, cached or matrix). The original instruction is expecting to be called with multiple values, one from each array in the no-cache/chached mode, but only once. In the Matrix mode, the instruction is presented with a value from each input data source but in all possible permutations.

---

## MIT License

Copyright (c) 2023 TGJ Gilmore

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
