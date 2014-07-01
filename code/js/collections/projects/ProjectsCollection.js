define([
  'jquery',
  'underscore',
  'parse',
  'models/project/ProjectModel'
], function($, _, Parse, ProjectModel){
  var ProjectsCollection = Parse.Collection.extend({
    model: ProjectModel,
    
    initialize: function(){

      //this.add([project0, project1, project2, project3, project4]);

    }

  });
 
  return ProjectsCollection;
});
