if (typeof _SA == "undefined") _SA = {};
_SA.PointRecs = _SA.PointRecs || new Meteor.Collection(null);
_SA.Tracks = _SA.Tracks || new Meteor.Collection(null);

Meteor.autosubscribe(function () {
  var curTrackId = Session.get("player:trackId");
  if (!curTrackId) return;

  console.log('DEBUG: subscribing to trackRec for current track', curTrackId);
  Meteor.subscribe('trackRec', curTrackId);
});

var _registerTrackData = function(result, opt_callback) {
  // xcxc!!!!! on firefox .data is not populated; and probably also android
  var trackData = result.data || JSON.parse(result.content);
  var id = trackData.id;
  trackData.lastUpdate = +new Date();

  // console.log('DEBUG: inserting track data for ' + id, trackData);
  _SA.Tracks.insert(trackData);

  Session.set('tracks:imageUrl+' + id,
    trackData.artwork_url ||
    (trackData.user && trackData.user.avatar_url) ||
    Template.soundcloudImg.DEFAULT_URL);
  Session.set('tracks:url+' + id,
    trackData.permalink_url);

  opt_callback && opt_callback(null, id);
};

var _soundcloudApiUrl = function(meat) {
  return "http://api.soundcloud.com/" + meat +
    "&client_id=17a48e602c9a59c5a713b456b60fea68";
};

var getTrackDataById = function(soundcloudId, opt_callback) {
  Meteor.http.get(
    _soundcloudApiUrl("tracks/" + soundcloudId + ".json?"),
    function (error, result) {
      if (error) {
        opt_callback && opt_callback(error);
      } else {
        _registerTrackData(result, opt_callback);
      }
    });
};

var getTrackDataFromUrl = function(soundcloudUrl, opt_callback) {
  console.log('sdbsdg');
  Meteor.http.get(
    _soundcloudApiUrl("resolve.json?url=" + soundcloudUrl),
    function (error, result) {
      if (error) {
        throw error;
      } else {
        _registerTrackData(result, opt_callback);
      }
    });
};
