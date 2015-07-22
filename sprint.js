Sprints = new Mongo.Collection("sprints");

if (Meteor.isClient) {
  Template.body.helpers ({
    sprints: function () {
      return Sprints.find({}, {sort: {createdAt: -1}});
    }
  });

  Template.body.events({

    "submit .new-sprints": function (event) {
      //this function is called when the new taks form is submitted
      var textSprint = event.target.text.value;

      Meteor.call("addSprint", textSprint); //add projects

      event.target.text.value = ""; //clear form
      return false; //prevent default form submit
    }
    // "submit .new-sprint": function (event) {
    //   //when a new sprint is submitted
    //   var textSprint = event.target.text.value;
    //   var projectID = event.target.project_id.value;

    // if (!Meteor.userId()) {
    //   throw new Meteor.Error("not-authorized");
    //   console.log ("not authorized"); //log in console
    // }

    // Meteor.call("addSprint", {
    //   text: textSprint,
    //   project_id: projectID,
    //   createdAt: new Date(), //current time
    //   deadline: new Date(+new Date + 12096e5), //two week from creation
    //   sprintOwner: Meteor.userId()
    // });

    //   event.target.text.value = "";
    //   return false;
    // }
  });

  Template.sprint.events ({
    "click .delete": function() {
      if (confirm("Are you sure you want to delete this sprint?") == true) {
          Meteor.call("deleteSprint", this._id);
      } else {
      }
    }
  });

  Template.sprint.helpers({
    tasks: function(sprintID) {
      return Tasks.find({sprint_id: sprintID});
    }

    //  sprints: function(){
    //   return Sprints.find();
    // }
  });
 }

Meteor.methods({
  addSprint: function(textSprint, projectID) { //add sprints
    // Sprints.insert(sprint);
    //var projectID = event.target.project_id.value;

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
      console.log ("not authorized"); //log in console
    }

    Sprints.insert ({
      text: textSprint,
      project_id: projectID,
      createdAt: new Date(), //current time
      deadline: new Date(+new Date + 12096e5), //two week from creation
      sprintOwner: Meteor.userId()
    });
  },

  deleteSprint: function (sprintId) { //delete sprints
    Sprints.remove(sprintId);
  }
});
