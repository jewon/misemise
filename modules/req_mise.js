// 측정소 geojson 받아서 미세먼지 데이터 요청해 추가해주는 모듈
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

module.exports = function(_mise_geojson, _key){
  const mise_sido = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"]

  // 시도별로 조회해서 측정소 위치 Geojson에 미세먼지 데이터 삽입
  mise_sido.map(function(sido){
    var xhr = new XMLHttpRequest();
    var mise_url = "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?numOfRows=100&ver=1.3&_returnType=JSON"
    mise_url += "&sidoName=" + encodeURIComponent(sido);
    mise_url += "&ServiceKey=" + _key;
    xhr.open("GET", mise_url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
    	if (xhr.readyState == 4 && xhr.status == 200) {
        console.log(sido + " 200 OK");
        var temp = JSON.parse(xhr.responseText);
        temp.list.map((obj) => {
          // 이름 같은 인덱스 찾아서 geojson의 속성에 pm25, pm10값 삽입
          let i = _mise_geojson.features.findIndex((loc) => loc.properties.stationName == obj.stationName)
          if (i > 0) {
            _mise_geojson.features[i].properties.pm25value = obj.pm25Value;
            _mise_geojson.features[i].properties.pm10value = obj.pm10Value;
            _mise_geojson.features[i].properties.pm25grade = obj.pm25Grade;
            _mise_geojson.features[i].properties.pm10grade = obj.pm10Grade;
            _mise_geojson.features[i].properties.sido = sido; // 시도명 저장
          } else {
            console.log("Warning: Can't find " + obj.stationName + " from mise_loc geojson");
          }

        })
      }
      else if (xhr.readyState == 4) {
        console.log(sido + " req failed... status : "+ xhr.status)
      }
    }
  });
  return _mise_geojson;
}
