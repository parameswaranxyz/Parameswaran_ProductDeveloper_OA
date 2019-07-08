# Shipment Details

It is a Node js RESTAPI for the shipments
src
 |_ routers
 |_ controllers
 |_ modules
tests
 |_ routers
 |_ controllers
 |_ modules

create database:
    create a user and an empty database (shipments)
    CREATE DATABASE shipments;
    CREATE USER jack WITH ENCRYPTED PASSWORD 'yourpass';
    GRANT ALL PRIVILEGES ON DATABASE shipments TO jack;

To start:
    npm run start

To load csv:
    localhost:8000/

To upload config:
    localhost:8000/config