define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/staticPages/aboutTemplate.html',
  'text!templates/staticPages/notFoundTemplate.html'
], function($, _, Backbone, aboutTemplate, notFoundTemplate){

  var HomeView = Backbone.View.extend({
    // el: $("#page"),
    templateName: 'notFoundTemplate',

    render: function(){
      $('.menu li').removeClass('active');
      $('.menu li a[href="#"]').parent().addClass('active');

      var template = notFoundTemplate;
      if (this.templateName == "about") {
        template = aboutTemplate;
      }
      this.$el.html(template);
    }

  });

  return HomeView;
  
});
