//TO DO
// - Sprints with deadlines

Tasks = new Mongo.Collection("tasks");

if (Meteor.isClient) {
  Template.body.helpers ({
    tasks: function () {
      if (Session.get("hideCompleted")) {// If hide completed is checked, filter tasks
        //show newest tasks first
        return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}});
      } else { // Otherwise, return all of the tasks
        return Tasks.find({}, {sort: {createdAt: -1}});
      }
    }
  });

  Template.body.events({
    "submit .new-tasks": function (event) {
      //when a new task is submitted
      var taskText = event.target.text.value;
      var projectID = event.target.project_id.value;
      var sprintID = event.target.sprint_id.value;
      // var today = new Date();
      // var dd = today.getDate();
      // var mm = today.getMonth()+1;
      // var yyyy = today.getFullYear();

    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
      console.log ("not authorized"); //log in console
    }

    Meteor.call("addTask", {
      text: taskText,
      project_id: projectID,
      sprint_id: sprintID,
      createdAt: new Date(), //current time
      deadline: new Date(+new Date + 12096e5),
      taskOwner: Meteor.userId()
    });

      event.target.text.value = "";
      return false;
    },

    //event handler to update a Session variable when the checkbox is checked or unchecked
    //Session is a convenient place to store temporary UI state
    "change .hide-completed input": function(event) {
      Session.set("hideCompleted", event.target.checked);
    }
  });

  Template.task.events ({
    "click .toggle-checked": function() {
      Meteor.call("checkTask",this._id, !this.checked);
    },

    "click .delete": function() {
      if (confirm("Are you sure you want to delete this task?") == true) {
          Meteor.call("deleteTask", this._id);
      } else {
      }
    },

    "change #user-select": function (event, template) {
      var taskId = this._id;
      var userId = $(event.currentTarget).val();
      console.log("assignedTask : " + userId, taskId);
      Meteor.call("assignTask", userId, taskId);
    }
  });

  Template.task.onRendered(function () {
    var $select = this.$('#user-select');
    $select.find('option').attr({
      selected: false
    });
    $select.find('option[value="' + this.data.assignedUser + '"]').attr({
      selected: true
    });
  });

  Template.task.helpers({
    user: function(){
      return Meteor.users.find();
    },

    tasks: function(){
      return Tasks.find();
    },
  });
}

Meteor.methods({
  addTask: function(task) { //add tasks
    Tasks.insert(task);
  },

  deleteTask: function (taskId) { //delete task
    Tasks.remove(taskId);
  },

  checkTask: function (taskId, setChecked) { //check off tasks
    Tasks.update(taskId, {$set: {checked: setChecked}});
  },

  assignTask: function (userId, taskId) { //assign tasks to users
    //need to save to all accounts
    Tasks.update({ _id: taskId }, {$set: {assignedUser: userId}});
  }
});






