## Route: /material

### Description

This route handles CRUD operations for materials, which represent the materials used in the production of products. It allows fetching a list of materials, fetching a specific material by ID, creating a new material, updating an existing material, and deleting a material.

### Middleware

- `adminAuth`: This middleware ensures that only authenticated admin users can access the routes protected by it.
- `validate`: This middleware is used for request validation based on the provided validators.

### Route Handlers

#### GET /material

- **Description**: Fetches a paginated list of materials based on query parameters like `limit`, `page`, `orderField`, `order`, `filterField`, and `filter`.
- **Request query parameters**:
  - `limit` (optional): The number of materials to fetch per page.
  - `page` (optional): The page number of materials to fetch.
  - `orderField` (optional): The field to use for ordering the materials (e.g., name).
  - `order` (optional): The order direction (e.g., "asc" for ascending, "desc" for descending).
  - `filterField` (optional): The field to use for filtering the materials (e.g., name).
  - `filter` (optional): The value to use for filtering the materials based on the filterField.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An object containing the paginated list of materials and the total number of pages.

#### GET /material/:materialId

- **Description**: Fetches a specific material by ID.
- **Request parameters**:
  - `materialId`: The ID of the material to fetch.
- **Response**:
  - **Status**: 200 (OK) if the material is found, 404 (Not Found) if the material with the specified ID does not exist.
  - **Body**: The material object if found.

#### POST /material

- **Description**: Creates a new material with the provided `name`.
- **Request body**:
  - `name`: The name of the new material.
- **Response**:
  - **Status**: 201 (Created) if the material is created successfully, 409 (Conflict) if a material with the same `name` already exists.
  - **Body**: The created material object.

#### PATCH /material/:materialId

- **Description**: Updates an existing material with the provided `name`.
- **Request parameters**:
  - `materialId`: The ID of the material to update.
- **Request body**:
  - `name` (optional): The new name value of the material.
- **Response**:
  - **Status**: 200 (OK) if the material is updated successfully, 404 (Not Found) if the material with the specified ID does not exist.
  - **Body**: The updated material object.

#### DELETE /material/:materialId

- **Description**: Deletes a material by ID.
- **Request parameters**:
  - `materialId`: The ID of the material to delete.
- **Response**:
  - **Status**: 200 (OK) if the material is deleted successfully, 404 (Not Found) if the material with the specified ID does not exist, 500 (Internal Server Error) if the material is associated with any products.
  - **Body**: An object with the result "OK" if the material is deleted successfully. If the material is associated with any products, the related product_materials are deleted before deleting the material.