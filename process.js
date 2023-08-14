async function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function process(a,b,c) {
  const hexValue = `${a}${b}${c}`;
  const decValue = parseInt(hexValue, 16);
  const result = `${hexValue} = ${decValue}`;
  console.log(result);
  await sleep(decValue);
  console.log(result);
  return result;
}

exports.process = process;
