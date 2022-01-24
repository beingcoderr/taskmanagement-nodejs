<table>
<tr>
<td>
<img src="https://cdn.freebiesupply.com/logos/large/2x/nodejs-1-logo-png-transparent.png" alt="NodeJS" height=50/>
</td>
<td>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Typescript_logo_2020.svg/1024px-Typescript_logo_2020.svg.png" alt="TypeScript" height="50"/>
</td>
<td>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/993px-Postgresql_elephant.svg.png" alt="Postgres" height="50" />
</td>
<td>
<img src="https://upload.wikimedia.org/wikipedia/commons/a/ab/Swagger-logo.png" alt="Swagger" height="50" >
</td>
<td>
<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/GraphQL_Logo.svg/2048px-GraphQL_Logo.svg.png"  alt="GraphQL" height="50">
</td>
</tr>
</table>

# Task/Issue Management Backend

This is new Task/Issue Management project and is in **development** stage. It supports RESTApi as well as GraphQL.<br>
REST doc is present at /api route and GraphQL will be found at /playground route.

This project is build using:

<li>NodeJS</li> 
<li>Postgres</li> 
<li>ExpressJS</li> 
<li>Sequelize ORM</li>
<li>Swagger OpenAPI for REST documentation</li>
<li>GraphQL</li>
<br>

## Steps to run this project
*Note: Basic knowledge of NodeJS and TypeScript is required*

<ol>
<li>Close this project into you local computer.</li>
<li>Install postgress for your platform from <a href = "https://www.postgresql.org/download/">download postgres</a></li>
<li>Download pgAdmin to create database in postgres from <a href = "https://www.pgadmin.org/download/">download pgAdmin</a></li>
<li>Create database named "taskmanagement" using pgAdmin. Make sure that postgres is runing.</li>
<li>Create .env file in the root of the project. And pass the following parameters.
<ul>
<li>JWT_SECRET="your-jwt-secret"</li>
<li>PORT=3000</li>
<li>DB_HOST=localhost</li>
<li>DB_DIALECT=postgres</li>
<li>DB_NAME=taskmanagement</li>
<li>DB_USERNAME=postgres</li>
<li>DB_PASSWORD=postgres</li>
<li>DB_PORT=5432</li>
</ul>
<li>Run the following command<br>
    npm run start:dev</li>
</ol>