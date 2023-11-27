## Route: /carousel

### Description

This route handles operations related to carousels, including retrieving carousel records, creating a new carousel record, and deleting a carousel record. The route requires authentication as an admin for accessing certain route handlers.

### Middleware

- `adminAuth`: This middleware function ensures that the user making the request is authenticated as an admin before proceeding with the route handlers. Only admin users can access the restricted routes.

### Route Handlers

#### GET /carousel

- **Description**: Retrieves a list of carousel records based on optional query parameters.
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

#### POST /carousel

- **Description**: Creates a new carousel record.
- **Request body**:
    - `image_url`: The URL of the image for the carousel.
- **Response**:
    - **Status**: 201 (Created)
    - **Body**: An object with a `result` property containing the newly created carousel record.

#### DELETE /carousel

- **Description**: Deletes a carousel record based on the specified `image_url`.
- **Request body**:
    - `image_url`: The URL of the image for the carousel to delete.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property indicating a successful deletion ("OK").