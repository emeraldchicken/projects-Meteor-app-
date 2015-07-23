Sprints = new Mongo.Collection("sprints");

if (Meteor.isClient) {
  Template.body.helpers ({
    sprints: function () {
      return Sprints.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({
    "submit .new-sprints": function (event) {
      //this function is called when the new sprint form is submitted
      var textSprint = event.target.text.value;
      var projectID = event.target.project_id.value;

      Meteor.call("addSprint", textSprint, projectID); //add sprints

      event.target.text.value = ""; //clear form
      return false; //prevent default form submit
    }
    // "submit .new-sprint": function (event) {
    //   //when a new sprint is submitted
    //   var textSprint = event.target.text.value;
    //   var projectID = event.target.project_id.value;
    //   var d = new Date(+new Date + 12096e5);
    //   var n = d.toDateString();

    // if (!Meteor.userId()) {
    //   throw new Meteor.Error("not-authorized");
    //   console.log ("not authorized"); //log in console
    // }

    // Meteor.call("addSprint", {
    //   text: textSprint,
    //   project_id: projectID,
    //   createdAt: new Date(), //current time
    //   deadline: n, //two week from creation
    //   sprintOwner: Meteor.userId()
    // });

    //   event.target.text.value = "";
    //   return false;

    //   console.log ("ProjectID: " + {project_id: projectID});
    // }
  });

  Template.sprint.events ({
    "click .delete": function() {
      if (confirm("Are you sure you want to delete this sprint?")) {
          Meteor.call("deleteSprint", this._id);
      }
    }
  });

  Template.sprint.helpers({
    tasks: function(sprintID) {
    // tasks: function(sprintID, projectID) {

      // return Tasks.find({sprint_id: sprintID}, {project_id: projectID});
      return Tasks.find({sprint_id: sprintID});
    }

    //  sprints: function(){
    //   return Sprints.find();
    // }
  });
 }

Meteor.methods({
  // addSprint: function(sprint) { //add sprints
  addSprint: function(textSprint, projectID) { //add sprints
    // Sprints.insert(sprint); //insert sprints
    var d = new Date(+new Date + 12096e5);
    var n = d.toDateString();

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
      console.log ("not authorized"); //log in console
    }

    Sprints.insert ({
      text: textSprint,
      project_id: projectID,
      createdAt: new Date(), //current time
      deadline: n, //two week from creation
      sprintOwner: Meteor.userId()
    });

    // console.log ("ProjectID: " + {project_id: projectID});
    console.log ("Text: " + textSprint);
    console.log ("ProjectID: " + projectID);
  },

  deleteSprint: function (sprintId) { //delete sprints
    Sprints.remove(sprintId);
  }
});
