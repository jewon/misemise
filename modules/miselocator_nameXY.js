// 측정소 json(mise_loc.json)을 {이름, [좌표]}형으로 바꿔주는 모듈(미사용)
module.exports = function(){
 var origin = require('../resources/mise_loc.json');
 var nameXY = []
 nameXY = origin.list.map((loc) => loc.stationName);
 return nameXY;
}
