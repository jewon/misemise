// pm값에 따라 마커 아이콘으로 사용할 링크를 반환해주는 모듈
function marker_link(pmValue, pm) { // @param pm : "pm10" 또는 "pm25"
  var marker_color_per10 = [
    "00FFFF", // 0
    "00FFBF", // 10
    "00FF80", // 20
    "00FF40", // 30
    "00FF00", // 40, good
    "40E600", // 50
    "80CC00", // 60
    "BFB300", // 70
    "FF9900", // 80, normal
    "FF7300", // 90
    "FF4D00", // 100
    "FF2600", // 110
    "FF0000", // 120, bad
    "D90000", // 130
    "B30000", // 140
    "8C0000", // 150
    "660000", // 160+, very bad
  ];

  var pmLevel;
  if (pm === "pm25") {
    pmLevel = parseInt(pmValue / 5)
  } else {
    pmLevel = parseInt(pmValue / 10)
  }

  if (pmLevel > 16) { pmLevel = 16; }
  if (!pmLevel && pmLevel != 0) { return "https://maps.gstatic.com/mapfiles/ms2/micons/mechanic.png" } // 정비소 마커
  else { return "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + parseInt(pmValue / 10) + "|" + marker_color_per10[pmLevel] + "|000000" }
}
