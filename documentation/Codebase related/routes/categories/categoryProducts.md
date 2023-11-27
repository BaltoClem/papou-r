## Route: /category/:categoryId/products

### Description

This route handles operations related to products within a specific category. It allows retrieving a list of products in a category and updating the products associated with a category. Access to these operations is restricted to admin users.

### Middleware

- `adminAuth`: This middleware function allows only admin users to access the route.
- `validate`: This middleware function validates the request body and parameters using the provided validation schema.

### Helper Functions

None

### Route Handlers

#### GET /category/:categoryId/products

- **Description**: Retrieves a paginated list of products in the specified category.
- **Request parameters**:
  - `categoryId`: The ID of the category to retrieve products from.
- **Request query parameters**:
  - `limit` (optional): The maximum number of products to retrieve per page.
  - `page` (optional): The page number to retrieve.
  - `orderField` (optional): The field to use for ordering the products.
  - `order` (optional): The order direction (asc or desc) for the ordering.
  - `filterField` (optional): The field to use for filtering the products.
  - `filter` (optional): The value to filter the products.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An object with a `result` property containing the paginated list of products in the category.

#### PATCH /category/:categoryId/products

- **Description**: Updates the products associated with a category.
- **Middleware**: `adminAuth`, `validate`
- **Request parameters**:
  - `categoryId`: The ID of the category to update products for.
- **Request body**:
  - `productsId`: An array of product IDs to associate with the category.
- **Response**:
  - **Status**: 200 (OK) if the category and products are found and updated successfully, 404 (Not Found) if the category or any of the products are not found, 409 (Conflict) if any of the products are already associated with the category.
  - **Body**: An object with a `result` property containing the updated list of products in the category.

#### DELETE /category/:categoryId/products

- **Description**: Removes the association between the specified products and the category.
- **Middleware**: `adminAuth`, `validate`
- **Request parameters**:
  - `categoryId`: The ID of the category to remove product associations from.
- **Request body**:
  - `productsId`: An array of product IDs to remove associations with the category.
- **Response**:
  - **Status**: 200 (OK) if the category and products are found and the associations are removed successfully, 404 (Not Found) if the category or any of the products are not found, 500 (Internal Server Error) if the category has no products.
  - **Body**: An object with a `result` property containing the string "OK" to indicate a successful deletion of associations.