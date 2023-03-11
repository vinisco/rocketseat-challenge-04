# Run Locally :computer:

Clone the project

```bash
git clone https://github.com/vinisco/rocketseat-challenge-04.git
```

Go to the project directory

```bash
cd rocketseat-challenge-04
```

Install dependencies

```bash
yarn
```

# 💻 About the Challenge

### In this challenge, you will need to create unit tests for the application.

# Application Routes

### POST /api/v1/users
- This route receives name, email, and password within the request body, saves the created user to the database, and returns an empty response with status 201.

### POST /api/v1/sessions
- This route receives email and password within the request body and returns the authenticated user's data along with a JWT token.

### GET /api/v1/profile
- This route receives a JWT token in the request header and returns the authenticated user's information.

### GET /api/v1/statements/balance
- This route receives a JWT token in the request header and returns a list of all deposit and withdrawal operations performed by the authenticated user, as well as the total balance in a balance property.

### POST /api/v1/statements/deposit
- This route receives a JWT token in the request header and amount and description in the request body, records the deposit operation for the value, and returns the created deposit information with status 201.

### POST /api/v1/statements/withdraw
- This route receives a JWT token in the request header and amount and description in the request body, records the withdrawal operation for the value (if the user has a valid balance), and returns the created withdrawal information with status 201.

### GET /api/v1/statements/:statement_id
- This route receives a JWT token in the request header and the ID of a registered operation (withdrawal or deposit) in the route URL, and returns the information of the found operation.

Test Solution

```bash
yarn test
```

# Authors

- [@vinisco](https://github.com/vinisco)
- [@rocketseat-education](https://github.com/rocketseat-education)
