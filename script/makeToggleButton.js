// 토글 버튼 만들어주는 모듈
// 참조: https://developers.google.com/maps/documentation/javascript/examples/control-custom-state
function ToggleButton(toggleDiv, map, toggleFunc) {
  var toggle = this;

  toggleDiv.style.clear = 'both';

  // PM10 UI
  var pm10UI = document.createElement('div');
  pm10UI.id = 'pm10UI';
  pm10UI.title = 'Click to View PM 10';
  toggleDiv.appendChild(pm10UI);

  // PM10 TEXT
  var pm10Text = document.createElement('div');
  pm10Text.id = 'pm10Text';
  pm10Text.innerHTML = 'PM 10';
  pm10UI.appendChild(pm10Text);

  // PM25 UI
  var pm25UI = document.createElement('div');
  pm25UI.id = 'pm25UI';
  pm25UI.title = 'Click to View PM 2.5';
  toggleDiv.appendChild(pm25UI);

  // PM25 TEXT
  var pm25Text = document.createElement('div');
  pm25Text.id = 'pm25Text';
  pm25Text.innerHTML = 'PM 2.5';
  pm25UI.appendChild(pm25Text);

  // PM10 클릭 동작
  pm10UI.addEventListener('click', function() {
    toggleFunc("pm10");
  });

  // PM25 클릭 동작
  pm25UI.addEventListener('click', function() {
    toggleFunc("pm25");
  });
}
