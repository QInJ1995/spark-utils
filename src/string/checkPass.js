/**
 * 判断密码等级
 * 密码等级,分为四种
 * 4种字符类型：0-9，a-z，A-Z，特殊字符
 * 难度等级1:6位纯数字
 * 难度等级2:4选2，8-16位
 * 难度等级3:4选3，8-16位（默认）
 * 难度等级4:4选4，10-18位
 * @param {value} string 字符串
 */
function checkPass (value) {
  if (typeof value === 'undefined') {
    return 0
  }
  let modes = 0

  if (/^\d{6}$/.test(value)) { // 6位纯数字
    return modes + 1
  }
  if (/[\u2E80-\u9FFF] | [\S]/.test(value)) { // 不能包含中文和空格
    return modes
  }
  if (value.length < 8 || value.length > 20) { // 密码长度8到20
    return modes
  }
  if (/\d/.test(value)) { // 如果用户输入的密码 包含了数字
    modes++
  }
  if (/[a-z]/.test(value)) { // 如果用户输入的密码 包含了小写的a到z
    modes++
  }
  if (/[A-Z]/.test(value)) { // 如果用户输入的密码 包含了大写的A到Z
    modes++
  }
  if (/[\W_]/.test(value)) { // 如果是特殊字符
    modes++
  }
  if (modes == 1) {
    modes = 0
  }

  return modes
}

export default checkPass

