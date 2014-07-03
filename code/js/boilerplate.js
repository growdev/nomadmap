define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/**template folder**/** template name **Template.html'
], function($, _, Backbone, viewTemplate){

  var **VIEW NAME** = Backbone.View.extend({
    render: function(){
      this.$el.html(template);
    }

  });

  return **VIEW NAME**;
  
});
