## Route: /product/:productId/materials

### Description

This route handles operations related to product materials. It allows fetching the materials associated with a product, updating the materials associated with a product, and deleting a material from a product.

### Middleware

- `adminAuth`: This middleware ensures that only authenticated admin users can access the routes protected by it.
- `validate`: This middleware is used for request validation based on the provided validators.

### Route Handlers

#### GET /product/:productId/materials

- **Description**: Fetches the materials associated with a specific product.
- **Request parameters**:
  - `productId`: The ID of the product.
- **Request query parameters**:
  - `limit` (optional): The number of materials to fetch per page.
  - `page` (optional): The page number of materials to fetch.
  - `orderField` (optional): The field to use for ordering the materials (e.g., name).
  - `order` (optional): The order direction (e.g., "asc" for ascending, "desc" for descending).
  - `filterField` (optional): The field to use for filtering the materials (e.g., name).
  - `filter` (optional): The value to use for filtering the materials based on the filterField.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An array of materials associated with the product.

#### PATCH /product/:productId/materials

- **Description**: Updates the materials associated with a specific product.
- **Request parameters**:
  - `productId`: The ID of the product.
- **Request body**:
  - `materialIds`: An array of material IDs to associate with the product.
- **Response**:
  - **Status**: 200 (OK) if the materials are updated successfully, 404 (Not Found) if the product with the specified ID does not exist or if any of the provided material IDs are not found, 500 (Internal Server Error) if there are any issues in updating the materials.
  - **Body**: An array of materials associated with the product after the update.

#### DELETE /product/:productId/materials/:materialId

- **Description**: Deletes a material from a specific product.
- **Request parameters**:
  - `productId`: The ID of the product.
  - `materialId`: The ID of the material to delete.
- **Response**:
  - **Status**: 200 (OK) if the material is deleted successfully, 404 (Not Found) if the product with the specified ID or the material with the specified ID does not exist, 500 (Internal Server Error) if there are no materials associated with the product.
  - **Body**: An object with the result "OK" if the material is deleted successfully.