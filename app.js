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
var req_miseloc = require('./modules/req_miseloc.js');
var req_mise = require('./modules/req_mise.js');
var doIDW = require('./modules/IDW.js');
var keys = require('./_config.js');

var req_times = 0; // 미세먼지 값 API 요청횟수
var mise_geojson = {};

req_miseloc(keys.mise_loc, function req_miseloc_cb() { //미세먼지 측정소 조회
  mise_geojson = locator_geojson(); // 조회 후 geojson변환
  if (req_times++ == 0) { // 서버 시작시 미세먼지 조회 및 측정소 조회 스케쥴링
    make_schedule_daily(req_miseloc(req_miseloc_cb, keys.mise_loc));
    make_schedule_hourly(req_mise(mise_geojson, keys.mise));
  }
});

function make_schedule_hourly (to_schedule) { // 미세먼지값 조회 스케쥴링
  // 1시간마다 반복작업 (node-schedule)
  let now = new Date(Date.now());
  console.log("PM Value will be update every " + now.getMinutes() + "m " + now.getSeconds() + "s (once an hour)");
  var job1 = schedule.scheduleJob(now.getSeconds() + ' ' + now.getMinutes() + ' * * * *', to_schedule);
}

function make_schedule_daily (to_schedule) { // 미세먼지측정소 조회 스케쥴링
  // 1일마다 반복작업 (node-schedule)
  let now = new Date(Date.now());
  console.log("Station Info will be update every " + now.getHours() + "h " + now.getMinutes() + "m (once a day)");
  var job2 = schedule.scheduleJob(now.getMinutes() + ' ' + now.getHours() + ' * * * *', to_schedule);
}

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
  console.log('Service is on port' + service_port);
});
