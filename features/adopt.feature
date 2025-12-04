@adoption
Feature: Adopting
  As a User
  I want to adopt trees
  So that I can take care of them

  Scenario: Bob adopts a tree
    Given "Bob" is authenticated
    And "Bob" has adopted 2 trees
    And "Tree" is an available tree
    When "Bob" attempts to adopt "Tree"
    Then "Tree" should become adopted by "Bob"
