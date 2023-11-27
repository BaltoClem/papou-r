## Route: /product

### Description

This route handles operations related to products. It allows creating a new product, updating an existing product, fetching a list of products, and deleting a product.

### Middleware

- `adminAuth`: This middleware ensures that only authenticated admin users can access the routes protected by it.
- `validate`: This middleware is used for request validation based on the provided validators.

### Route Handlers

#### POST /product

- **Description**: Creates a new product.
- **Request body**:
  - `name`: The name of the product.
  - `description`: The description of the product.
  - `price`: The price of the product.
  - `stock`: The stock quantity of the product.
  - `dimension_id`: The ID of the product dimension.
- **Response**:
  - **Status**: 201 (Created)
  - **Body**: An object containing the created product.

#### PATCH /product/:productId

- **Description**: Updates an existing product.
- **Request parameters**:
  - `productId`: The ID of the product to update.
- **Request body**:
  - `name` (optional): The updated name of the product.
  - `description` (optional): The updated description of the product.
  - `price` (optional): The updated price of the product.
  - `stock` (optional): The updated stock quantity of the product.
  - `dimension_id` (optional): The updated ID of the product dimension.
- **Response**:
  - **Status**: 200 (OK) if the product is updated successfully, 404 (Not Found) if the product with the specified ID does not exist.
  - **Body**: An object containing the updated product.

#### GET /product

- **Description**: Fetches a list of products.
- **Request query parameters**:
  - `limit` (optional): The number of products to fetch per page.
  - `page` (optional): The page number of products to fetch.
  - `orderField` (optional): The field to use for ordering the products (e.g., name).
  - `order` (optional): The order direction (e.g., "asc" for ascending, "desc" for descending).
  - `filterField` (optional): The field to use for filtering the products (e.g., name).
  - `filter` (optional): The value to use for filtering the products based on the filterField.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An object containing an array of products and the total number of pages.

#### GET /product/:productId

- **Description**: Fetches a specific product by ID.
- **Request parameters**:
  - `productId`: The ID of the product to fetch.
- **Response**:
  - **Status**: 200 (OK) if the product is found, 404 (Not Found) if the product with the specified ID does not exist.
  - **Body**: An object containing the fetched product and related products.

#### DELETE /product/:productId

- **Description**: Deletes a specific product by ID.
- **Request parameters**:
  - `productId`: The ID of the product to delete.
- **Response**:
  - **Status**: 200 (OK) if the product is deleted successfully, 404 (Not Found) if the product with the specified ID does not exist.
  - **Body**: An object with the result "OK" if the product is deleted successfully.