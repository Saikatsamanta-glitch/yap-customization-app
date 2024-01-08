## What does this pull request do?
<!---
To be updated by the developer creating a pull request
--->

Any additional comments that the developer wants to add.

## Does this pull request meet the acceptance criteria?

*To be updated by the maintainer/code reviewer processing a pull request.*

### Conformity

Check off each item when the guidelines are met for the code written.

- [ ] Documentation and Update README.md.
- [ ] No custom linter rules are added and all code linting rules are passed.
- [ ] NPM packages are audited and (1) no unused packages are present and (2) no package has any security vulnerability reported at a moderate level on production dependencies.

### Sonarqube Code Quality Conformity

- [ ] Sonarqube: Code coverage is more than 90%
- [ ] Sonarqube: Code smells are no more than 3
- [ ] Sonarqube: Duplicate lines are not more than 3%
- [ ] Sonarqube: Maintainability rating is no worse than A
- [ ] Sonarqube: Reliability rating is no worse than A
- [ ] Sonarqube: Security hotspots are reviewed is not below 100%
- [ ] Sonarqube: Reliability rating is no worse than A

### Availability and Testing

- [ ] Project must build successfully
- [ ] All test cases are passed
- [ ] Swagger document is updated

### Security

*To be updated by the operations team member only.*

If this pull request contains changes to processing or storing of PII(Personal Identifiable Information), authorization and authentication methods.

- [ ] All user/customer/session PII data is encrypted before being stored in a persistent store.
- [ ] None of the API is returning reset tokens or information that is not supposed to be sent out.
