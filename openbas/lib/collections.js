Points = new Meteor.Collection("points");
Rooms = new Meteor.Collection("rooms");
HVAC = new Meteor.Collection("hvac");
Lighting = new Meteor.Collection("lighting");
Monitoring = new Meteor.Collection("monitoring");
Schedules = new Meteor.Collection("schedules");
MasterSchedule = new Meteor.Collection("master_schedule");
Unconfigured = new Meteor.Collection("unconfigured");

if (Meteor.isServer) {

  if (Schedules.find({}).fetch().length == 0){
    var schedules = EJSON.parse(Assets.getText("schedules.json"));
    _.each(schedules, function(s){
      Schedules.insert(s);
    });
  }

  if (MasterSchedule.find({}).fetch().length == 0){
    MasterSchedule.insert({
      'mon': 'weekday',
      'tue': 'weekday',
      'wed': 'weekday',
      'thu': 'weekday',
      'fri': 'weekday',
      'sat': 'weekend',
      'sun': 'weekend',
    });
  }
 
  if (Rooms.find({}).fetch().length == 0){
    var rooms = EJSON.parse(Assets.getText(Meteor.settings.roomsfile));
    _.each(rooms, function(r){
      Rooms.insert(r);
    });
  }
  
  Meteor.publish("master_schedule", function () {
    return MasterSchedule.find({}, { fields: { '_id': 0 } });
  });
  Meteor.publish("schedules", function () {
    return Schedules.find({});
  });

}
