# HNG stage 2 Task

## Description
This is a submission for the HNG Internship stage 2 task of the backend track.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [Testing](#testing)
- [Deployment](#deployment)
- [Built With](#built-with)
- [Acknowledgments](#acknowledgments)
- [License](#license)
- [Contact Information](#contact-information)

## Installation
### Prerequisites
To run this application, you must have Nodejs installed on your system. You also need to have POSTGRESQL
- [click to download Nodejs](https://nodejs.org/en/download/package-manager)
<!-- - [click to download MYSQL](https://www.mysql.com/downloads/) -->
### Installation guide
- Clone the repository with `git clone https://github.com/Paul-Wisdom/Budget-Tracking-Application.git`
- Open the repository locally and navigate to the root directory
- Install the dependencies using `npm install`
- Start the server with `npm run start`
## Usage
coming soon

## Configuration
The Project has a number of configurable environmental variables which can be found in the .env.example file at the root of the project. The variables are;
 
- ### DB_NAME
This is the name of the database Schema
- ### DB_USER
This is the name of the database User
- ### DB_PASS
This is the password of the database
- ### JWT_SCR_KEY
This is the secret string used to hash the application's JSON Web Tokens.
- ### PORT
This is the port on which the application's server is being run on your machine.

## API Documentation
List of API endpoints with details.
- ### POST `/auth/register`
Endpoint for registering users. It receives five fields; firstName, lastName, email, password, phone
- ### POST `/auth/login`
Endpoint for signing in. It receives email and password
- ### GET `api/users/:id` \[PROTECTED] 
Returns information about the user whose id is sent as a request parameter if the user belongs to any organisation the logged in user belongs to or if the id is that of the logged in user
- ### GET `api/organisations` \[PROTECTED]
Get information on all organisation the logged in user belongs to
- ### GET `api/organisations/:orgId` \[PROTECTED]
Get information on organisation with attacehd orgId if the logged in user belongs to that organisation
- ### POST `api/organisations` \[PROTECTED]
Receives name and description property. It creates an organisation belonging to the logged in user with the name and description provided
- ### POST `/api/organisations/:orgId/users` \[PROTECTED]
Receives userId. It adds user with that userId to an organisation with id orgId if tge logged in user belongs to that organisation

## Contributing
Guidelines for contributing to the project.
coming soon

## Testing
This application uses jest and supertest for unit and end to end tests.
You can test the application with the command `npm run test`

## Deployment
Instructions on how to deploy the project.
coming soon

## Built With
- Express
- Postgresql
- Bcryptjs
- Sequelize
- JSON Web Tokens
## Acknowledgments
Credits and links to resources.
coming soon

## License
Information about the license.
coming soon

## Contact Information
[X formerly(twitter)](https://x.com/patch01010?t=8NSsYoaLyq3oWmBcrWJTJA&s=09)
[LinkedIn](https://www.linkedin.com/in/paul-wisdom-03710b254/)