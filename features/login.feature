@authentication
Feature: Logging in

  # Scenario: Bob logs in
  #   Given Bob is already averified user with email "email1@gmail.com" and password "password1"
  #   When Bob starts the login process
  #   And Bob enters the email "email1@gmail.com"
  #   And Bob enters the password "password1"
  #   And Bob completes the login process
  #   Then Bob should be authenticated

  Scenario: Bob logs in
    Given "Bob" is already a verified user
    When "Bob" logins
    Then "Bob" should be authenticated
