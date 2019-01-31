// 미세먼지 geojson을 sido(시도)별 평균을 내서 반환
module.exports = function(_mise_geojson){
  var sido_pm = {};
  const mise_sido = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"]
  for (i in mise_sido) {
    sido_pm[mise_sido[i]] = {"pm10count" : 0, "pm25count": 0, "pm10mean": 0.0, "pm25mean": 0.0, "pm10grade" : "-", "pm25grade" : "-"}
  }

  //console.log(sido_pm)
  _mise_geojson.features.map((feature) => {
    let sido = feature.properties.sido;
    if (sido != null) {
      if (feature.properties.pm10value > 0) {
        sido_pm[sido].pm10count += 1;
        sido_pm[sido].pm10mean += parseInt(feature.properties.pm10value);
      }
      if (feature.properties.pm25value > 0) {
        sido_pm[sido].pm25count += 1;
        sido_pm[sido].pm25mean += parseInt(feature.properties.pm10value);
      }
    }
  })

  for (i in mise_sido) {
    sido_pm[mise_sido[i]].pm10mean /= sido_pm[mise_sido[i]].pm10count;
    sido_pm[mise_sido[i]].pm25mean /= sido_pm[mise_sido[i]].pm25count;
  }
  return sido_pm;
}
