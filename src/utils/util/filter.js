export default {
  /**
   * 金额过滤器
   * @type {RegExp}
   */
  currency(value, _currency, decimals){
  let digitsRE = /(\d{3})(?=\d)/g;
  value = parseFloat(value);
  if (!isFinite(value) || !value && value !== 0) return '';
  // 设置货币单位名称
  _currency = _currency != null ? _currency : '￥';
  // 表示要保留的小数位2表示保留两位小数
  decimals = decimals != null ? decimals :2;
  let stringified = Math.abs(value).toFixed(decimals);
  let _int = decimals ? stringified.slice(0, -1 - decimals) : stringified;
  let i = _int.length % 3;
  let head = i > 0 ? _int.slice(0, i) + (_int.length > 3 ? ',' : '') : '';
  let _float = decimals ? stringified.slice(-1 - decimals) : '';
  let sign = value < 0 ? '-' : '';
  return sign + _currency + head + _int.slice(i).replace(digitsRE, '$1,') + _float;
}
}
