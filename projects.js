Projects =  new Mongo.Collection("projects");

if (Meteor.isClient) {
  // This code only runs on the client
  Session.set('selectedProject', 0);
  //Meteor.subscribe("directory"); // client subscribes to all the data from that publication, which in this case is all of the projects in the database
  //if block to filter the projects if the checkbox is checked
  Template.body.helpers ({
    projects: function () {
        return Projects.find({});
    },

    currentProject: function () {
      return Projects.findOne({_id: Session.get('selectedProject')});
    },

    hideCompleted: function() { //hide projects
      return Session.get("hideCompleted");
    },

    //count projects that haven't been checked off
    incompleteCount: function() {
      //return Projects.find({}).count();
      return Projects.find({checked: {$ne: true}}).count();
    }
  });

  Template.body.events({
    "submit .new-projects": function (event) {
      //this function is called when the new taks form is submitted
      var text = event.target.text.value;

      Meteor.call("addProject", text); //add projects

      event.target.text.value = ""; //clear form
      return false; //prevent default form submit
    },

    "change #project-select": function (event, template) {
      var select = $(event.currentTarget).val();
      console.log("selectedProject : " + select);
      Session.set('selectedProject', select);
      // Meteor.call("selectProject", select);
    }
  });

  Template.project.events({
    "click .toggle-checked": function() {
      //set checked property to the opposite of its current value
      Meteor.call("setChecked",this._id, !this.checked);
    },

    "click .delete": function() {
      if (confirm("Are you sure you want to delete this task?")) {
          Meteor.call("deleteProject", this._id);
      }
    }
  });

  Template.project.helpers({
    tasks: function(projectID) {
      if (Session.get("hideCompleted")) {
        return Tasks.find({project_id: projectID, checked: {$ne: true}})
      }
      return Tasks.find({project_id: projectID});
    },

    sprints: function(projectID) {
      return Sprints.find({project_id: projectID});
    },

    //count tasks that haven't been checked off
    incompleteCount1: function() {
      //return Tasks.find({checked: {$ne: true}}).count();
      return Tasks.find({checked: {$ne: true}, project_id: this._id}).count();
    },

    totalCount: function() {
      return Tasks.find({project_id: this._id}).count();
    },

    selectProject: function(select) {
      return Projects.find({$set: {selectedProject: select}});
    }
  });

  Template.example.helpers({
    options: function() {
      return {
        defaultView: 'basicWeek'
      };
    }
  });

  // Template.fullcalendar.rendered = function() {
  //   var div = this.$(this.firstNode);
  //   //jquery takes care of undefined values, no need to check here
  //   div.attr('id',this.data.id);
  //   div.addClass(this.data.class);
  //   div.fullCalendar(this.data);
  // };

  //configure accouts UI to use usernames instead of email addresses
  Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
  });
}

Meteor.methods ({
  addProject: function(text) { //if user is not logged in they cannot insert projects
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
      console.log ("not authorized"); //log in console
    }

    Projects.insert ({
      text: text,
      createdAt: new Date(),
      projectOwner: Meteor.userId()
    });
    console.log ("Text: " + text);
  },

  deleteProject: function (projectId) { //delete project
    Projects.remove(projectId);
  },

  setChecked: function (projectId, setChecked) { //check off project
    Projects.update(projectId, {$set: {checked: setChecked}});
  },

  selectProject: function (select) { //select users to display
    Projects.update({$set: {selectedProject: select}});
  }
});
