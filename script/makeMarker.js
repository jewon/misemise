// 미세먼지 수치로 마커 색상 결정(연속적), 유의: deprecated API 사용(현재 미사용)
function pm10LevelToMarker(pm10Level) {
  var red = 0;
  var blue = 0;
  var green = 0;
  var err = false;

  // Spectrum: 00FFFF (0, cyan) - 00FF00 (40, green) - FF8000 (80, Orange) - 800000 (200, Maroon)
  if (pm10Level > 200) { red = 128; } // Dark Orange
  else if (pm10Level > 80) { red = 255 - (pm10Level - 80) * 127 / 120; green = red + 127 } // 나쁨~
  else if (pm10Level > 40) { red = (pm10Level - 40) * 255 / 40; green = 255 - red / 2 } // 보통~
  else if (pm10Level > 0) { blue = (40 - pm10Level) * 255 / 50; green = 255 } // 좋음~
  else { err = true; } // 값이 0이거나 측정값 이상

  if (err) { return "https://maps.gstatic.com/mapfiles/ms2/micons/mechanic.png" } // 정비소 마커
  else { return "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + parseInt(pm10Level / 10) + "|" + make2digit(parseInt(red).toString(16)) + make2digit(parseInt(green).toString(16)) + make2digit(parseInt(blue).toString(16)) + "|000000" }
}

// 16진수를 두 자리 스트링으로 반환(URI 삽입용)
function make2digit(hex) {
  if (hex == 0) { return '00'; }
  else if (hex.length == 1) { return '0' + hex; }
  else { return hex.substring(0, 2); }
}

// 미세먼지 등급별 마커 소스 링크
function gradeToMarker(grade) {
  if (grade == 1) { return "https://maps.gstatic.com/mapfiles/ms2/micons/blue.png"}
  else if (grade == 2) { return "https://maps.gstatic.com/mapfiles/ms2/micons/green.png"}
  else if (grade == 3) { return "https://maps.gstatic.com/mapfiles/ms2/micons/yellow.png"}
  else if (grade == 4) { return "https://maps.gstatic.com/mapfiles/ms2/micons/red.png"}
  else { return "https://maps.gstatic.com/mapfiles/ms2/micons/mechanic.png"}
}
