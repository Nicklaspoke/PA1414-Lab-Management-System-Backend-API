# PA1414-Lab-Management-System-Backend-API

This is the backen API for my individual project in the course PA1414 at [BTH](https://bth.se)

# How to install, set up and run this

To run and set up this application. You will need the following prerequisites
* nodejs version 8.10 or higher
*  My [database setup](https://github.com/Nicklaspoke/PA1414-Lab-Management-System-Database-SQL)

## Install
After downloading or cloning this repo. In the same folder as the `*Package.json` file run the following command `npm install` to install all the reqiured packages.

## Set up/configure

The configuration that needs to be done before running this.

First rename the file `config-example.json` to `config.json` in the folder `config`. Here you will configure the port that the server will run on and provide the enrty `jwtSecret` with a 256 bit string that will be used to generate the JSON Web tokens the system uses.

After that in the folder `config/db` rename the file `login-example.json` to `login.json`

Then configure the following:
* `host` - The address or ip that the database server is running on
* `user` - The user that was created in the database setup
* `password` - The password that was choosen for the user
* `database` - The name of the database default is **lab_management_system**

## Run the application

After you have done all the setup and installed the database. use `npm run start` to start the server on the port you choose in the config file
