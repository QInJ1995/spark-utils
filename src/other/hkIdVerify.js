function hkIdVerify(str, errors) {
    const strValidChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // basic check length
    if (str.length < 8) {
        errors.push('身份证验证失败!长度小于8');
        return false;
    }
    // handling bracket
    if (str.charAt(str.length - 3) === '(' && str.charAt(str.length - 1) === ')') {
        str = str.substring(0, str.length - 3) + str.charAt(str.length - 2);
    }
    // convert to upper case
    str = str.toUpperCase();
    // regular expression to check pattern and split
    const hkIdPat = /^([A-Z]{1,2})([0-9]{6})([A0-9])$/;
    const matchArray = str.match(hkIdPat);
    // not match, return false
    if (matchArray == null) {
        errors.push('身份证验证失败!不满足正则表达式验证规则(^([A-Z]{1,2})([0-9]{6})([A0-9])$)');
        return false;
    }
    // the character part, numeric part and check digit part
    const charPart = matchArray[1];
    const numPart = matchArray[2];
    const checkDigit = matchArray[3];
    // calculate the checksum for character part
    let checkSum = 0;
    if (charPart.length === 2) {
        checkSum += 9 * (10 + strValidChars.indexOf(charPart.charAt(0)));
        checkSum += 8 * (10 + strValidChars.indexOf(charPart.charAt(1)));
    }
    else {
        checkSum += 9 * 36;
        checkSum += 8 * (10 + strValidChars.indexOf(charPart));
    }
    // calculate the checksum for numeric part
    let i = 0, j = 7;
    for (; i < numPart.length; i++, j--) {
        checkSum += j * (Number)(numPart.charAt(i));
    }
    // verify the check digit
    const remaining = checkSum % 11;
    const verify = remaining === 0 ? '0' : `${11 - remaining}`;
    if (verify === checkDigit || (verify === '10' && checkDigit === 'A')) {
        return true;
    }
    else {
        errors.push('香港身份证验证失败');
        return false;
    }
}

export default hkIdVerify
