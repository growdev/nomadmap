Parse.Cloud.define("register", function(request, response) {
  var referralCode = request.params.referralCode;
  var email = request.params.email;
  var password = request.params.password;

  if (!isValidEmailFormat(email)) {
  	response.error("Invalid email address format");
  	return;
  }

  if (!isValidPasswordFormat(password)) {
  	response.error("Invalid password");
  	return;
  }  

  if (!isValidReferralCode(referralCode)) {
  	response.error("Invalid referral code");
  	return;
  }

  response.success("success");
});