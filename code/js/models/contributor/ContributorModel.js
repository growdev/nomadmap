define([
  'underscore',
  'parse',
], function(_, Parse) {

  var ContributorModel = Parse.Model.extend({

  	defaults : {
  		medalHex : '#A67D3D',
  		picWidth : '100px',
  		githubPath : 'concat github and login'
  	}

  });

  return ContributorModel;

});
