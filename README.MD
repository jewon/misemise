# **misemise**
![alt text](/docs/sample.png)
(2018. 8. 6 update)

## Project Main Goal
* 미세먼지 정보(PM10, PM2.5)를 실시간으로 받아 Google Map에 시각화  
* 임의 위치(Default: 사용자 위치)의 미세먼지 값을 IDW를 이용해 추정  

## Requirement
* AppKey: [한국환경공단 대기오염정보 조회 서비스](https://www.data.go.kr/dataset/15000581/openapi.do), [한국환경공단 측정소정보 조회 서비스](https://www.data.go.kr/dataset/15000660/openapi.do), [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial)  
* Server: `Node.js`, `npm` : `Express`(라우팅) `xmlhttprequest`(먼지값 API)  

## Tech
* `Node.js`

## Commit log
* 20180806 미세먼지 값 조회 및 Google Map에 등급에 따라(좋음, 보통, 나쁨)마커 색상으로 나타내기  
* 20180806 브라우저 단에서 사용할 수 있는 js Script 링크 생성(/script)
* 20180806 미세먼지 값을 10으로 나눈 수를 마커 라벨로 나타냄, 그 수에 따라 마커 색상(17단계) 정하도록 변경  
