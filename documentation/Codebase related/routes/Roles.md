## Route: /role

### Description

This route handles operations related to roles, including retrieving role records, retrieving a specific role record, creating new role records, updating a role record, and deleting a role record. The route requires authentication as an admin for accessing certain route handlers.

### Middleware

- `adminAuth`: This middleware function ensures that the user making the request is authenticated as an admin before proceeding with the route handlers.
- `validate`: This middleware function validates the request parameters based on specified validation rules.

### Route Handlers

#### GET /role

- **Description**: Retrieves a list of role records based on optional query parameters.
- **Request query parameters**:
    - `limit` (optional): The maximum number of records to retrieve per page.
    - `page` (optional): The page number to retrieve.
    - `orderField` (optional): The field to use for ordering the records.
    - `order` (optional): The order direction (asc or desc) for the ordering.
    - `filterField` (optional): The field to use for filtering the records.
    - `filter` (optional): The value to filter the records.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the retrieved records.

#### GET /role/:roleId

- **Description**: Retrieves a specific role record based on the provided `roleId`.
- **Request parameters**:
    - `roleId`: The ID of the role to retrieve.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the retrieved role record.

#### POST /role

- **Description**: Creates a new role record.
- **Request body**:
    - The request should include a JSON object in the request body with the following properties:
        - `name` (required): The name of the role.
- **Response**:
    - **Status**: 201 (Created)
    - **Body**: An object with a `result` property containing the created role record.

#### PATCH /role/:roleId

- **Description**: Updates an existing role record.
- **Request parameters**:
    - `roleId`: The ID of the role to update.
- **Request body**:
    - The request should include a JSON object in the request body with the following properties:
        - `name` (required): The updated name of the role.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the updated role record.

#### DELETE /role/:roleId

- **Description**: Deletes a role record.
- **Request parameters**:
    - `roleId`: The ID of the role to delete.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property indicating a successful deletion ("OK").