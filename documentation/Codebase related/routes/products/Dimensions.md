## Route: /dimension

### Description

This route handles CRUD operations for dimensions, representing the physical dimensions of products. It allows fetching a list of dimensions, fetching a specific dimension by ID, creating a new dimension, updating an existing dimension, and deleting a dimension.

### Middleware

- `adminAuth`: This middleware ensures that only authenticated admin users can access the routes protected by it.
- `validate`: This middleware is used for request validation based on the provided validators.

### External Dependencies

- `ref` from Objection: This is used to handle conditional updates in the database when patching a dimension.

### Route Handlers

#### GET /dimension

- **Description**: Fetches a paginated list of dimensions based on query parameters like `limit`, `page`, `orderField`, `order`, `filterField`, and `filter`.
- **Request query parameters**:
  - `limit` (optional): The number of dimensions to fetch per page.
  - `page` (optional): The page number of dimensions to fetch.
  - `orderField` (optional): The field to use for ordering the dimensions (e.g., height, width, length).
  - `order` (optional): The order direction (e.g., "asc" for ascending, "desc" for descending).
  - `filterField` (optional): The field to use for filtering the dimensions (e.g., height, width, length).
  - `filter` (optional): The value to use for filtering the dimensions based on the filterField.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An object containing the paginated list of dimensions and the total number of pages.

#### GET /dimension/:dimensionId

- **Description**: Fetches a specific dimension by ID.
- **Request parameters**:
  - `dimensionId`: The ID of the dimension to fetch.
- **Response**:
  - **Status**: 200 (OK) if the dimension is found, 404 (Not Found) if the dimension with the specified ID does not exist.
  - **Body**: The dimension object if found.

#### POST /dimension

- **Description**: Creates a new dimension with the provided `height`, `width`, and `length`.
- **Request body**:
  - `height`: The height value of the new dimension.
  - `width`: The width value of the new dimension.
  - `length`: The length value of the new dimension.
- **Response**:
  - **Status**: 201 (Created) if the dimension is created successfully, 409 (Conflict) if a dimension with the same `height`, `width`, and `length` already exists.
  - **Body**: The created dimension object.

#### PATCH /dimension/:dimensionId

- **Description**: Updates an existing dimension with the provided `height`, `width`, and `length`.
- **Request parameters**:
  - `dimensionId`: The ID of the dimension to update.
- **Request body**:
  - `height` (optional): The new height value of the dimension.
  - `width` (optional): The new width value of the dimension.
  - `length` (optional): The new length value of the dimension.
- **Response**:
  - **Status**: 200 (OK) if the dimension is updated successfully, 404 (Not Found) if the dimension with the specified ID does not exist.
  - **Body**: The updated dimension object.

#### DELETE /dimension/:dimensionId

- **Description**: Deletes a dimension by ID.
- **Request parameters**:
  - `dimensionId`: The ID of the dimension to delete.
- **Response**:
  - **Status**: 200

 (OK) if the dimension is deleted successfully, 404 (Not Found) if the dimension with the specified ID does not exist, 500 (Internal Server Error) if the dimension is associated with any products.
  - **Body**: An object with the result "OK" if the dimension is deleted successfully. If the dimension is associated with any products, an error object is returned with the "E.DIMENSION.IN_USE" error code and the list of products using the dimension.