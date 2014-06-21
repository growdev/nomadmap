--------------------
Register
--------------------
This method is called when a user tries to register with an email, referral code and password.

Parameters:
- email
- password
- referralCode

Response:
{
  "result": "success"
}

--------------------
JoinWaitingList
--------------------
Method used to add a user on the "waiting list" when he doesn't have a referral code

Parameters:
- email

Response:
{
  "result": "success"
}