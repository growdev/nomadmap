Parse.Cloud.define("isValidEmailFormat", function(email) {
  if (email == "test") {
    return false;
  }

  return true;
});

Parse.Cloud.define("isValidReferralCode", function(referralCode) {
  if (referralCode == "test") {
    return false;
  }


  return true;
});

Parse.Cloud.define("isValidPasswordFormat", function(password) {
  if (password == "test") {
    return false;
  }

  return true;
});