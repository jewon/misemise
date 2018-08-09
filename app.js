const http = require('http');
const fs = require('fs');
// const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var express = require('express');
var app = express();
const schedule = require('node-schedule');
const hostname = 'localhost';
const service_port = 1337;
var locator_geojson = require('./modules/miselocator_geojson.js');
var get_miseloc_arr = require('./modules/geojson_getnamearray.js');
var get_distance_XY = require('./modules/getDistanceFromXY.js');
var req_mise = require('./modules/req_mise.js');
var doIDW = require('./modules/IDW.js');
var keys = require('./_config.js');

// 타이머
const startTime = new Date(Date.now() + 3000); // 3초 뒤 서비스
const req_mise_min  = startTime.getMinutes();
const req_mise_sec = startTime.getSeconds();
console.log("PM Value will be update every " + req_mise_min + "m " + req_mise_sec + "s");

// 측정소 위치 불러옴
var mise_geojson = locator_geojson();

// 1시간마다 반복작업 (node-schedule)
var req_times = 0;
var j = schedule.scheduleJob(req_mise_sec + ' ' + req_mise_min + ' * * * *', function(){
  // 각 측정소에 미세먼지 값 요청해 추가
  req_mise(mise_geojson, keys.mise);
  console.log("---Reqest Airkorea API " + (++req_times) + " times---" )
});

// 메인
app.get('/', (req, res) => {
  if (req_times === 0) { res.status(404).send("서비스 준비중입니다")}
  else {
    fs.readFile('index.html', function(err, data){
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(data);
    })
  }
})

// 브라우저단 스크립트 소스
app.use('/script', express.static("./script"));

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
  if (!reqlat || !reqlng) { // param이 숫자 아닌경우
    return res.status(400).json({ error : "Incorrect LatLng" })
  }

  var distance_value_pm10 = [];
  var distance_value_pm25 = [];

// 반경 10km 이내 Station 찾기 (getDistanceFromXY 모듈)
  mise_geojson.features.forEach(s => {
    let distance = get_distance_XY(reqlat, reqlng, s.geometry.coordinates[1], s.geometry.coordinates[0]);
    if (distance < 10 && !isNaN(+s.properties.pm10value)) {
      distance_value_pm10.push({"distance" : distance, "value" : s.properties.pm10value});
    };
    if (distance < 10 && !isNaN(+s.properties.pm25value)) {
      distance_value_pm25.push({"distance" : distance, "value" : s.properties.pm25value});
    }
  });

  // 찾은 station들의 먼지값 IDW계산
  let resultJson = { result : { pm10 : { result: "", stations: [], message: ""}, pm25 : { result : "", stations: [], message: ""}}};
  if (!distance_value_pm10[0]) {
    resultJson.result.pm10.message = "No Station Near 10km(PM10)!";
  }
  else {
    resultJson.result.pm10.result = doIDW(distance_value_pm10);
    resultJson.result.pm10.stations = distance_value_pm10;
  }
  if (!distance_value_pm25[0]) {
    resultJson.result.pm25.message = "No Station Near 10km(PM25)!";
  }
  else {
    resultJson.result.pm25.result = doIDW(distance_value_pm25);
    resultJson.result.pm25.stations = distance_value_pm25;
  }
  return res.json(resultJson);
})

app.listen(service_port, () => {
  console.log('Example app listening on port' + service_port);
});
