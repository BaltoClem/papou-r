
# A complete breakdown

## Requirements

```
node version : v19 -> As seen in the .nvmrc
postgresql : latest version
two .env files ( more details later )
```

## Running the back-end : 

### Installing the dependences : 

In your terminal, with node installed, run `npm install` to install the required packages.
You will also need a .env file, formatted as follows :
```bash
DB__CLIENT=pg
DB__PORT=yourdbport
DB__HOST=yourdbhost
DB__USER=your postgresql user
DB__PASSWORD=the password associated with your pg user
DB__DATABASE=name of your databse
JWT_SECRET=a random string
PASSWORD_PEPPER= a random string
ADMIN_PASSWORD=password for the admin account in the seeds
USER_PASSWORD=same as above, but for a regular account
MAIL_SEND_GRID=email tied to the sendgrid account
SENDGRID_API_KEY=our sendgrid api key
AWS_ACCESS_KEY_ID=our aws access key
AWS_SECRET_ACCESS_KEY=same as above
AWS_BUCKET_NAME=name of our s3 bucket
AWS_BUCKET_REGION=our bucket\'s region
STRIPE_API_KEY=our stripe api key
FRONT_URL=http://localhost:3001
ENDPOINTSECRET=the code provided by stripe to make sure that the payment comes from them.
```

you will then need to run `npm run first_run` to run the latest knex migrations and seed the database.

### Starting the server

Once the first step is complete, you can start the backend at anytime by using running `npm start` in your terminal.

## Running the front-end :

### installing the dependencies :

In your terminal, with node installed, run `npm install`.
You will also need a .env file, formatted as follows :
```bash
NEXT_PUBLIC_API_BASEURL=LINK_TO_THE_DATABASE
```

### Starting the website :

In your terminal, once again, run `npm next dev`. You should be able to access your frontend at the url given by your terminal (localhost:3001 per default)


## NOTE : 
You must always run the backend first. Make sure that your postgresql is started beforehand !!