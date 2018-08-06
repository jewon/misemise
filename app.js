const http = require('http');
const fs = require('fs');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();
const hostname = 'localhost';
const service_port = 1337;
var locator_geojson = require('./modules/miselocator_geojson.js');
var get_miseloc_arr = require('./modules/geojson_getnamearray.js');
var get_distance_XY = require('./modules/getDistanceFromXY.js');
var doIDW = require('./modules/IDW.js');
var keys = require('./_config.js');

// 측정소 위치 불러옴
var mise_geojson = locator_geojson();
// 조회할 시도명 코드들
var mise_sido = ["서울", "부산", "대구", "인천", "광주", "대전", "울산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주", "세종"]

// 시도별로 조회해서 측정소 위치 Geojson에 미세먼지 데이터 삽입
mise_sido.map(function(sido){
  var xhr = new XMLHttpRequest();
  var mise_url = "http://openapi.airkorea.or.kr/openapi/services/rest/ArpltnInforInqireSvc/getCtprvnRltmMesureDnsty?numOfRows=100&ver=1.3&_returnType=JSON"
  mise_url += "&sidoName=" + encodeURIComponent(sido);
  mise_url += "&ServiceKey=" + keys.mise;
  xhr.open("GET", mise_url, true);
  xhr.send();
  xhr.onreadystatechange = function() {
  	if (xhr.readyState == 4 && xhr.status == 200) {
      var temp = JSON.parse(xhr.responseText);
      temp.list.map((obj) => {
        // 이름 같은 인덱스 찾아서 geojson의 속성에 pm25, pm10값 삽입
        let i = mise_geojson.features.findIndex((loc) => loc.properties.stationName == obj.stationName)
        mise_geojson.features[i].properties.pm25value = obj.pm25Value;
        mise_geojson.features[i].properties.pm10value = obj.pm10Value;
        mise_geojson.features[i].properties.pm25grade = obj.pm25Grade;
        mise_geojson.features[i].properties.pm10grade = obj.pm10Grade;
      })
    }
    else {
      console.log(xhr.status + ": req failed" + sido)
    }
  }
});

// 메인
app.get('/', (req, res) => {
  fs.readFile('index.html', function(err, data){
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(data);
  })
})

// 측정소 목록 전체 응답용 API
app.get('/api/loc', (req, res) => res.json(mise_geojson))

// 특정 스테이션 API (먼지값포함)
app.get('/api/mise/:stationName', (req, res) => {
  let station = mise_geojson.features.filter(s => req.params.stationName == s.properties.stationName)[0];
  if(!station) {
    return res.status(404).json({ error : "Unknown StationName" });
  }
  else {
    return res.json(station);
  }
})

// 특정 위치 먼지값(IDW) API
app.get('/api/mise/latlng/:lat/:lng', (req, res) => {
  let reqlat = parseFloat(req.params.lat);
  let reqlng = parseFloat(req.params.lng);
  if (!reqlat || !reqlng) {
    return res.status(400).json({ error : "Incorrect LatLng" })
  }
  var distance_value = [];

  // 반경 10km 이내 Station 찾기
  let stations10km = mise_geojson.features.filter(s => {
    let distance = get_distance_XY(reqlat, reqlng, s.geometry.coordinates[0], s.geometry.coordinates[1]);
    distance_value.push({"distance" : distance, "value" : s.properties.pm10Value})
    return (distance < 10)
  });

  // 찾은 station들의 먼지값 IDW계산
  if (!distance_value[0]) {
    return res.json({ message : "No Station Near 10km" });
  }
  else {
    return res.json({ result : doIDW(distance_value) });
  }
})

app.listen(service_port, () => {
  console.log('Example app listening on port' + service_port);
});
