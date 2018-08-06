// 특정지점의 다른 관측점들과의 거리-관측값 배열에서 IDW에 의한 특정지점의 추정값 구하는 모듈(미사용)
module.exports = function(distance_value_array){
  let sumIdistance = 0;
  distance_value_array.foreach(element => {
    let Idistance = pow(element.distance, -1);
    sumIdistance += Idistance;
    element.Idistance = Idistance;
  })

  let sumIDWvlaue = 0;
  distance_value_array.foreach(element => {
    sumIDWvalue += element.Idistance * element.value;
  })

  return sumIDWvalue/sumIdistance;
}
