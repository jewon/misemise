function marker_link(pm10value) {
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

  var pm10level = parseInt(pm10value / 10);
  if (pm10level > 16) { pm10level = 16; }

  if (!pm10level && pm10level != 0) { return "https://maps.gstatic.com/mapfiles/ms2/micons/mechanic.png" } // 정비소 마커
  else { return "https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=" + parseInt(pm10value / 10) + "|" + marker_color_per10[pm10level] + "|000000" }
}
