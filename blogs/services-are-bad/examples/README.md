# Examples for the Services are Bad blog

All examples solve the same problem: A simple issue tracking system with pull request links.

The purpose of these examples is to compare different implementation paradigms.

## Problem Description
A user opens an issue.
A user creates a pull request for that issue.
A user reviews the pull request.
A user merges the pull request.
A user validates the issue has been fixed.
A user reviews the issue and closes it.

### Domain Objects
#### User
Has an identifier, username and hidden password.

#### Issue
Has an identifier, name and status.
May not be linked to a pull request.
May be linked to more than one pull requests.
May only be linked to one Open pull request.

Status is a state machine:
```mermaid
Open -- create pull request --> Review
Review -- reject pull request --> Open
Review -- approve pull request --> Validate
Validate -- fix worked --> Done
Validate -- fix did not work --> Open
Open -- close issue --> Closed
Review -- close issue --> Closed (+ reject current pull request)
Validate -- close issue --> Closed
```

#### Pull Request
Has an identifier, name and status.
Is linked to an issue.
Is linked to the author.
A Pull Request cannot be approved by the original author.
A Rejected pull request cannot be reopened.

Status is one of Open, Rejected or Approved.

Actions are done through the issue that is linked with the pull request.

## Requirements
Use a domain-centric architecture:
- Domain layer captures the essence of the problem
- Application layer captures any code related to actions against the domain
- Inward adapters layer provides ways to access the domain (REST API, GraphQL API)
- Outward adapters layer provides ways to interface with external system (InMemory Database, MongoDB Database, MySQL Database, File Database)

Layers must be clearly separated from each other.

APIs and Database Schemas must be identical between all languages.

A CLI will provide a way to interact with all services.
A suite of acceptance tests will be ran identically between all services.

### REST API
Swagger documentation for the REST API is defined in [swagger](swagger).

### GraphQL API
GraphQL API schema is defined in [schema](schema.graphql).

Logged in user information passed through `Authorization` header, using format `User <base64(<username>:<password>)>`.
Unauthorized errors are returned using GraphQL Errors.
Not Found errors are returned using GraphQL Errors.
Application errors are returned within mutation payloads.
### MongoDB Schema
### MySQL Schema
### File Schema

## Tools
### Dependencies
Dependencies are defined in the [docker compose](docker-compose.yaml) file and can be started with `docker compose up -d`.

### Services
Services must define a Dockerfile that will allow deploying the service within docker. 

References to these Dockerfiles will be in [services docker compose](services.yaml).
Building a service can be done with `docker compose -f services.yaml build <service>`.
Starting a service can be done with `docker compose -f services.yaml up -d <service>`.

### CLI
A CLI will be available as a REPL to interact with the different services.
The CLI is available through docker with `docker compose attach cli`.

Commands:
- `use <service>` to indicate against which service to run commands.
- `send <rest|graphql>` to indicate which API to use.
- `users` to list users.
- `user <username>` to create a new user and/or login as user for following commands.
- `issues` to list issues.
- `issue create` to create a new issue.
- `issue <id>` to use issue for following commands.
- `issue resolve` to resolve the current issue.
- `pr create` to create a pull request in the current issue.
- `pr reject <id>` to reject a pull request.
- `pr approve <id>` to approve a pull request.

### Acceptance & Load Tests
Tests will be created in a k6 image to allow running them as acceptance tests or load tests for all services.

## Languages
### NodeJs Express
### NodeJs NestJs
### Go
### Rust
### Java Spring Boot
### C# dotnet core
