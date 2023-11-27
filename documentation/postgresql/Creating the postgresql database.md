# How to create the postgresql database

## REQUIREMENTS

1. Have pg installed and running
2. Have a user already created.

## Creating the table

1. Login as the postgre user using `sudo -i -u postgres`
2. Start the pg interface using `psql`
3. Once in the pg shell, run `create database DATABASENAME;`

Once this has been ran, you can exit the psql shell by typing `exit;`