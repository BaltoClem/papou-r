# Our testing policy

## Backend policy 

1. **Whenever you add a new route, write a new test taking into account everything single use case you might think off.**
2. The tests should be able to be ran offline, with no connection to the internet.
3. NEVER MERGE A FAILING TEST.
4. "I'll write this test later" means you'll never write it. DO IT NOW.
5. The test description should be written in english and include the method and the route : 
```js
describe("ROUTE NAME - GET / POST / DELETE / PATCH ", () => {} )
```

## Frontend policy 
1. Test your new code as if you were a user. A stupid user.
2. Test the correct way to do things, but also the wrong way to use your website, as to catch any errors.