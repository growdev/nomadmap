define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/staticPages/aboutTemplate.html',
  'text!templates/staticPages/notFoundTemplate.html'
], function($, _, Backbone, aboutTemplate, notFoundTemplate){

  var HomeView = Backbone.View.extend({
    el: $("#page"),

    renderPage: function(templateName){
      $('.menu li').removeClass('active');
      $('.menu li a[href="#"]').parent().addClass('active');

      var template = notFoundTemplate;
      if (templateName == "about") {
        template = aboutTemplate;
      }
      this.$el.html(template);
    }

  });

  return HomeView;
  
});
