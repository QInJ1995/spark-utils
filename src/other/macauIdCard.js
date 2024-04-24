const macauRegex = /^[1|5|7][0-9]{6}[0-9A-Z]$/;
function macauIdCard(str, errors) {
    if (macauRegex.test(str)) {
        return true;
    }
    errors.push('澳门身份证验证失败!');
}

export default macauIdCard 