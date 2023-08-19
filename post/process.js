async function process(a, b, c) {
  const result = `${a}${b}${c}`;
  if (result === '666') {
    throw Error('Number of the beast');
  }
  return result;
}

exports.process = process;
