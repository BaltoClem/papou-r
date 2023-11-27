# About the back-end

## How to run the backend

1. Make sure to have a postgres database available and configured in your .env (more information in the documentation
2. Using node 19.7.X, install the node dependencies using `npm ci`
3. Run the seeds and set up your environnement first, using `npm run first_run`.
4. Make sure that everything is working by using `npm test`. If you have any issues with the test, it is highly possible that your .env is wrong.
5. Run the API using `npm start` !



## How to run the tests

Before pushing anything, always run the tests using `npm test`. If you wish to only run one test, use `npm test tests/the_test_you_wish_to_run`. Note that you can also use a regex to match the patterns of the tests you'd like to run.
These tests shouldn't take more than 11s to run, but may depend on your connexion. If any test tied to the payment fail, feel free to update the "test-timeout" variable in the package.json.
