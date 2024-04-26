/**
 * @category 二代身份证验证
 */
const factors = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
const validateCode = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
function validate2ndIdCard(idCard, errors) {
	// 二代身份证长度验证
	if (idCard.length !== 18) {
		errors.push('身份证长度不合法');
		return;
	}
	let checksum = 0;
	factors.forEach((factor, i) => {
		const v = Number(idCard.charAt(i));
		checksum += v * factor;
	});
	const result = checksum % 11;
	if (validateCode[result] !== idCard.charAt(17)) {
		errors === null || errors === void 0 ? void 0 : errors.push('身份证编码规则验证失败');
	}
}
export default validate2ndIdCard;
