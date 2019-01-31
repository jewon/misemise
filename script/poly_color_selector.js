//pm값에 따라 폴리곤 색상을 정하여 반환 (marker_url_generator와 유사)

function pmPolyColor (pmValue, pm) {
  const color_per10 = [
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

  //console.log(pmValue, pmLevel, color_per10[pmLevel]);
  return "#" + color_per10[pmLevel];
}
