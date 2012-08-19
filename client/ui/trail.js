Template.trail.list = function () {
  var pointId = Session.get("point:id");
  var point = _SA.Points.findOne({pointId: pointId});
  var result = (point && point.trail) || [];
  return result;
};

Template.trail.vote = function () {
  return this.weight > 0 ? '+' : '-';
};
