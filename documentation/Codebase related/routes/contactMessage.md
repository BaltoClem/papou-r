## Route: /contact

### Description

This route handles operations related to contact messages, including retrieving contact message records, retrieving a specific contact message record, creating a new contact message record, and deleting a contact message record. The route requires authentication as an admin for accessing certain route handlers.

### Middleware

- `adminAuth`: This middleware function ensures that the user making the request is authenticated as an admin before proceeding with the route handlers. Only admin users can access the restricted routes.
- `validate`: This middleware function validates the request body or parameters based on specified validation rules.

### Route Handlers

#### GET /contact

- **Description**: Retrieves a list of contact message records based on optional query parameters.
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

#### GET /contact/:messageId

- **Description**: Retrieves a specific contact message record based on the provided `messageId`.
- **Request parameters**:
    - `messageId`: The ID of the contact message to retrieve.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the retrieved contact message record.

#### POST /contact

- **Description**: Creates a new contact message record.
- **Request body**:
    - `email`: The email address associated with the contact message.
    - `title`: The title of the contact message.
    - `text`: The content of the contact message.
- **Response**:
    - **Status**: 201 (Created)
    - **Body**: An object with a `result` property indicating a successful creation ("OK").

#### DELETE /contact/:messageId

- **Description**: Deletes a contact message record based on the specified `messageId`.
- **Request parameters**:
    - `messageId`: The ID of the contact message to delete.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property indicating a successful deletion ("OK").