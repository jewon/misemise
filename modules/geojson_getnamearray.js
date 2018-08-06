// 미세먼지 측정소 목록에서 이름만을 추출해 배열로 반환하는 모듈
module.exports = function(){
  var origin = require('../resources/mise_loc.json');
  return origin.list.map(loc => loc.stationName);
}
