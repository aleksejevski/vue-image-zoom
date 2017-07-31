export default function (length = 8){
	const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	const charSetLength = charSet.length;
  
	let randomId = '';
	for (let i = 0; i < length; i++) {
		const position = Math.floor(Math.random() * charSetLength);
		randomId += charSet[position];
	}
	return randomId;
}