https://github.com/CodemaniaNG/backend-assessment/blob/main/README.md

### Step 1 - Setup
- You want to install the required packages, navigate to the base folder and run `yarn dev`, this will install all the required packages
- Next start run the `docker compose up` to start-up the postgres on port (5432), server on port (8100) and adminer on port (8100)
- Run generate script `yarn run generate`
- Run migration script `yarn run migrate`
- Seed the DB `yarn run db:seed`
- Create your `.env` by following the `.env.example` in the repo 

### step 2 - Creating an account
Create an account from the api endpoint `{{base_url}}/auth/register` copy the generated [api-key] and include it to the header["Authorization"] = [api-key] of subsequent request.
- [x] api to create an account and generate api key
- [x] api to create a package
- [x] api to get all packages
- [x] api to update a package
- [x] api to retrieve a package
- [x] add rate limiting
- [x] api to track a package
- [x] Restricted routes
- [x] Protected routes 
