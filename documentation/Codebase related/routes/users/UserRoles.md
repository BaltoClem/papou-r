## Route: /user/:userId/roles

### Description

This route handles user roles related operations, such as getting the roles of a user, assigning a role to a user, and removing a role from a user.

### Middleware

- `adminAuth`: This middleware is used to authenticate and authorize the admin user.

### Route Handlers

#### GET /user/:userId/roles

- **Description**: Retrieves the roles of a user.
- **Authorization**: Requires admin authentication.
- **Parameters**:
  - `userId`: The ID of the user.
- **Response**:
  - **Status**: 200 (OK) if the roles are retrieved successfully.
  - **Body**: An object with the result containing an array of roles assigned to the user.

#### POST /user/:userId/roles

- **Description**: Assigns a role to a user.
- **Authorization**: Requires admin authentication.
- **Parameters**:
  - `userId`: The ID of the user.
- **Request body**:
  - `name`: The name of the role to assign to the user.
- **Response**:
  - **Status**: 201 (Created) if the role is assigned to the user successfully.
  - **Body**: An object with the result "OK" if the role is assigned to the user successfully.

#### DELETE /user/:userId/roles/:roleId

- **Description**: Removes a role from a user.
- **Authorization**: Requires admin authentication.
- **Parameters**:
  - `userId`: The ID of the user.
  - `roleId`: The ID of the role to remove from the user.
- **Response**:
  - **Status**: 200 (OK) if the role is removed from the user successfully.
  - **Body**: An object with the result "OK" if the role is removed from the user successfully.

Note: The helper functions `alreadyExistsError` and `notFoundError` are used to handle error responses for duplicate records and not found records, respectively.