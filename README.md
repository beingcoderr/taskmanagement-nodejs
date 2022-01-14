# Task/Issue Management Backend

This is new Task/Issue Management project and is in **development** stage.

This project is build using:

<li>NodeJS</li> 
<li>Postgres</li> 
<li>ExpressJS</li> 
<li>Sequelize ORM</li>
<li>Swagger for documentation</li>
<br>

## Steps to run this project

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