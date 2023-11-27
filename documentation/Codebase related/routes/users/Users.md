## Route: /user

### Description

This route handles operations related to users, such as retrieving a list of users, getting a specific user, updating a user's information, and deleting a user.

### Middleware

- `adminAuth`: This middleware is used to authenticate and authorize the admin user.
- `auth`: This middleware is used to authenticate the user.

### Route Handlers

#### GET /user

- **Description**: Retrieves a list of users.
- **Authorization**: Requires admin authentication.
- **Query Parameters**:
  - `limit`: The maximum number of users to retrieve per page (optional).
  - `page`: The page number of the users to retrieve (optional).
  - `orderField`: The field to use for ordering the users (optional).
  - `order`: The order direction ("asc" or "desc") for the ordering (optional).
  - `filterField`: The field to use for filtering the users (optional).
  - `filter`: The value to filter the users by (optional).
- **Response**:
  - **Status**: 200 (OK) if the list of users is retrieved successfully.
  - **Body**: An object with the result containing an array of users and the total number of pages.

#### GET /user/:userId

- **Description**: Retrieves a specific user.
- **Authorization**: Requires user authentication.
- **Parameters**:
  - `userId`: The ID of the user.
- **Response**:
  - **Status**: 200 (OK) if the user is retrieved successfully.
  - **Body**: An object with the result containing the user's information.

#### PATCH /user/:userId

- **Description**: Updates a user's information.
- **Authorization**: Requires user authentication.
- **Parameters**:
  - `userId`: The ID of the user.
- **Request body**:
  - `display_name` (optional): The updated display name of the user.
  - `email` (optional): The updated email address of the user.
  - `password` (optional): The updated password of the user.
  - `phone_number` (optional): The updated phone number of the user.
- **Response**:
  - **Status**: 200 (OK) if the user's information is updated successfully.
  - **Body**: An object with the result containing the updated user's information.

#### DELETE /user/:userId

- **Description**: Deletes a user.
- **Authorization**: Requires user authentication.
- **Parameters**:
  - `userId`: The ID of the user.
- **Response**:
  - **Status**: 200 (OK) if the user is deleted successfully.
  - **Body**: An object with the result "OK" if the user is deleted successfully.

Note: The helper functions `adminOrSelfAuth` and `notFoundError` are used to handle authorization and error responses for admin or self-authentication and not found records, respectively.