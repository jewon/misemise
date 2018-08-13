// 측정소 정보를 조회하여 결과값을 그대로 mise_loc.json에 저장하는 모듈
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
const fs = require('fs')

module.exports = function (_key, callback){
  let xhr = new XMLHttpRequest();
  let url = "http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getMsrstnList?addr=&pageNo=1&numOfRows=500&_returnType=json"
  url += "&ServiceKey=" + _key; // 서비스키 추가부
  xhr.open("GET", url, true);
  xhr.send();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      save(xhr.responseText);
    }
    else if (xhr.readyState === 4 && xhr.status !== 0) {
      console.log("Mise-Loc update Failed : "+ xhr.status)
    }
  }

  function save(json) {
    fs.writeFile('resources/mise_loc.json', json, 'utf8', err => {
      if (err) {
        console.log("Mise-Loc file save error: " + err);
      }
      else {
        console.log("Location Updated");
        callback();
      }
    });
  }
  // http://openapi.airkorea.or.kr/openapi/services/rest/MsrstnInfoInqireSvc/getMsrstnList?addr=&pageNo=1&numOfRows=500&ServiceKey=*******서비스키*******&_returnType=json
}
