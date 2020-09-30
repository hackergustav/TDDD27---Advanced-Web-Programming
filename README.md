# TDDD27_2020_docs_collab

Midcourse screencast: https://youtu.be/Loj0LDi7B3U

## Functional Specification
 
The idea for this project is to create a collaborative document editing, storage  and viewing service. The vision for the system is to enable groups to easily collaborate on and create documents in a way akin to how websites are created using tools such as wordpress with its block editor. This system is intended to be used for creation of documents that are not long reports or the like that are formatted to be printed. Instead these documents are intended for internal use in organisations, such as policy documents, project plans, guides and tutorials.
 
Inspiration for this project has been Confluence by Atlassian (https://www.atlassian.com/software/confluence). We would like to create something along these lines that will not cost us a recurring fee to utilize.
 
The core feature of the system is to enable editing of documents using a block-editor.
 
Users should be able to organise into groups.
 
Users should be able to be part of multiple groups.
 
All users in a group should have access to shared documents for that group.
 
All documents belong to a group.
 
Documents should be able to link to other documents in the same group.
 
Documents should be able to be structured into a hierarchy analogous to a file system with directories.
 
The documents and their associated editor shall be able to handle embedded media, tables, lists and general text formatting.

## Technological specification

The back end for the project will be an API created using Python 3.8.X and Flask 1.1.X.
The database for the project will be an SQL-database(SQLlight initially). And we will use the SQLAlchemy ORM for interaction between the Flask API and the database.
 
The front end will be created using Angular 9.0.X.
 
The block editor for the system will be Editor.js(https://editorjs.io/).

Authentication for the system will be provided by auth0.com.
 
Postman will be used for testing and development of the API.
 
The front end will be tested using the Karma test runner that comes bundled with Angular.
 
~~Circle CI will be used for continuous integration and testing of each commit.~~ Gitlab CI Pipeline will be used for for continuous integration and testing of each commit.
 
Deployment will be made on an Ubuntu 18.0.4 VPS, using nginx as a reverse proxy server.
 
Deployment will be handled by a simple shell script.
