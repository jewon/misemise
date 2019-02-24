# **misemise**
![alt text](/sample.png)
(2019. 1. 31 update)

## Project Main Goal
* 미세먼지 정보(PM10, PM2.5)를 실시간으로 받아 Google Map에 시각화  
* 임의 위치(Default: 사용자 위치)의 미세먼지 값을 IDW를 이용해 추정  

## Requirement & Dependancy
* AppKey: [한국환경공단 대기오염정보 조회 서비스](https://www.data.go.kr/dataset/15000581/openapi.do), [한국환경공단 측정소정보 조회 서비스](https://www.data.go.kr/dataset/15000660/openapi.do), [Google Maps Javascript API](https://developers.google.com/maps/documentation/javascript/tutorial)  
* Server: `Node.js`  
* npm : `express`(라우팅) `xmlhttprequest`(먼지값 API 요청) `node-schedule`(스케쥴러)  

## Tech
* `Node.js`
* `Maps Javascript API V3` (google)

## Commit log
* 20180806 미세먼지 값 조회 및 Google Map에 등급에 따라(좋음, 보통, 나쁨)마커 색상으로 나타내기  
* 20180806 브라우저 단에서 사용할 수 있는 js Script 링크 생성(`/script`)
* 20180806 미세먼지 값을 10으로 나눈 수를 마커 라벨로 나타냄, 그 수에 따라 마커 색상(17단계) 정하도록 변경  
* 20180808 임의 위치 PM10값 추정(IDW) API 완성(`/api/mise/loc/:lat/:lng`), 마커의 위치 변경시 추정값 보여줌
* 20180808 1시간마다 PM값 자동업데이트, 사소한 편의사항들, 리펙토링 조금 (측정값 조회부분 모듈화 등)
* 20180809 IDW에서 PM2.5값 함께 연산해서 응답(표출X), 사소한 버그 수정
* 20180809 PM10, PM2.5값 모두 표출 가능하도록 버튼 추가 및 이에 따른 API, 모듈 일부 수정
* 20180813 미세먼지 측정소 위치 조회 모듈 추가, 측정소 위치 조회 작업 자동 업데이트(1일 1회)
* 20190105 측정소 조회 결과 목록에는 있으나, 먼지값 응답에는 없는 측정소 관련 오류 핸들링
* 20190117 시도폴리곤 관련 코드 추가(폴리곤 파일은 비공개), zoom level기준 마커/폴리곤 전환
* 20190131 시도폴리곤 색상을 해당 시도 평균PM값에 따라 변화시키는 기능 추가
* 20190224 폴리곤 롤오버 효과, 측정소 및 먼지값 조회 스케쥴링 작동 문제 해결(함수화)

## To Be Continue
* 폴리곤 색상 지역 평균 미세먼지값 기준으로 다변화 및 정보 표기, 마우스 오버 이벤트
  - 변화 시점(이벤트) 명료화 필요
  - 마우스 오버시 평균 미세먼지값 보여주는 기능
  - 시도 - 시군구 단위로 폴리곤 스케일 2단계로 세분화 필요
* 행정구역 단위 측정소 측정값 평균 폴리곤 만들어 보여주기(지도 스케일에 따라서 바꿔가면서), 마커 클러스터링
* 측정소 값 서버 저장 (SQL? FS?)
* 측정소 마커 및 Floating 마커 클릭시 저장된 값 요약해 보여주는 페이지 (간단한 그래프 포함)
  - ejs 렌더링 통한 동적 페이지 (url: `/loc/:lat/:lng`, `/station/:측정소명`)
  - 페이지 틀 제작 필요
  - 그래프
* 현재 위치로 핀 옮기는 버튼 생성 (Custom Controls 메뉴 활용)
* 좋음-나쁨 기준 알려주는 색상 바 표출
* 버그 수정
