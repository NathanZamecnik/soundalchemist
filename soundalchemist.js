if (typeof _SA == "undefined") _SA = {};

_SA.Points = _SA.Points || new Meteor.Collection("Points");
// console.log('DEBUG: resetting Points db...');
// _SA.Points.remove({});

_SA.TrackRecs = _SA.TrackRecs || new Meteor.Collection("TrackRecs");
// CAUTION: THIS IS EXPENSIVE TO REBUILD!
// /*
// console.log('DEBUG: resetting TrackRecs db...');
// _SA.TrackRecs.remove({});
// */

var makePoint = function(point, trackId, weight) {
  var trail = point.trail;

  var newPointId = trackId + '_' + weight + '___';
  newPointId += _.map(trail, function(trailPoint) {
    return trailPoint.trackId + '_' + trailPoint.weight;
  }).join('___');

  newPointId = Meteor._srp.SHA256(newPointId);
  console.log('DEBUG: blazing ', newPointId, trackId, weight);

  // if() // new pointId exists

  var newTrail = _.clone(point.trail);
  // The current trailPoint to prepend to the trail to make the new point
  var trailPoint = {
    pointId: point.pointId,
    trackId: trackId,
    weight: weight
  };
  newTrail.unshift(trailPoint); // anti-push

  var newPoint = {
    pointId: newPointId,
    trackId: trackId,
    trail: newTrail
  };
  console.log('DEBUG: creating newPoint', newPointId, newPoint);
  _SA.Points.insert(newPoint);
  return newPointId;
};
