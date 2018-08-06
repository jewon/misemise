// 측정소 json(mise_loc.json)을 geoJson으로 변환해 반환해주는 모듈
module.exports = function(){
 var origin = require('../resources/mise_loc.json');
 var geojson = {
   "type": "FeatureCollection",
   "features": []
 }
 geojson.features = origin.list.map(function(loc){
   return {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [Number(loc.dmY), Number(loc.dmX)]
    },
    "properties": {
      "stationName": loc.stationName,
      "item" : loc.item.split(','),
      "addr" : loc.addr,
    }
  }
 });
 return geojson;
}
