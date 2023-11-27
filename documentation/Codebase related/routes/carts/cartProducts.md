## Route: /cart/:cartId/products

### Description

This route handles operations related to cart products, including retrieving cart products, adding a product to the cart, updating the quantity of a product in the cart, and removing a product from the cart. The route allows both authenticated and unauthenticated users to access it. If a user is authenticated, their session ID will be stored.

### Middleware

- `softAuth`: This middleware function allows both authenticated and unauthenticated users to access the route. If the user is authenticated, their session ID will be stored.
- `validate`: This middleware function validates the request body against specific validation rules.

### Helper Functions

- `doesCartContainProduct`: This function checks if a cart contains a specific product.

### Route Handlers

#### GET /cart/:cartId/products

- **Description**: Retrieves a list of products in the specified cart.
- **Middleware**: `softAuth`
- **Request parameters**:
    - `cartId`: The ID of the cart to retrieve the products from.
- **Request query parameters**:
    - `limit` (optional): The maximum number of products to retrieve per page.
    - `page` (optional): The page number to retrieve.
    - `orderField` (optional): The field to use for ordering the products.
    - `order` (optional): The order direction (asc or desc) for the ordering.
    - `filterField` (optional): The field to use for filtering the products.
    - `filter` (optional): The value to filter the products.
- **Response**:
    - **Status**: 200 (OK) if the cart is found, 404 (Not Found) otherwise.
    - **Body**: An object with a `result` property containing the retrieved products in the cart.

#### POST /cart/:cartId/products

- **Description**: Adds a product to the specified cart.
- **Middleware**: `softAuth`
- **Request parameters**:
    - `cartId`: The ID of the cart to add the product to.
- **Request body**:
    - `productId`: The ID of the product to add.
    - `quantity`: The quantity of the product to add.
- **Response**:
    - **Status**: 201 (Created) if the cart and product are found, and the product is added successfully, 404 (Not Found) otherwise.
    - **Body**: An object with a `result` property containing the added product.

#### PATCH /cart/:cartId/products

- **Description**: Updates the quantity of a product in the specified cart.
- **Middleware**: `softAuth`
- **Request parameters**:
    - `cartId`: The ID of the cart containing the product.
- **Request body**:
    - `productId`: The ID of the product to update.
    - `quantity`: The updated quantity of the product.
- **Response**:
    - **Status**: 200 (OK) if the cart, product, and the product exists in the cart, and the quantity is updated successfully, 403 (Forbidden) if the product does not exist in the cart, or 404 (Not Found) if the cart or product is not found.
    - **Body**: An object with a `result` property containing the updated product.

#### DELETE /cart/:cartId/products/:productId

- **Description**: Removes a product from the specified cart.
- **Middleware**: `softAuth`
- **Request parameters**:
    - `cartId`: The ID of the cart containing the product.
    - `productId`: The ID of the product to remove.
- **Response**:
    - **Status**: 200 (OK) if the cart, product, and the product exists in the cart, and the product is removed successfully, 403 (Forbidden) if the product does not exist in the cart, or 404 (Not Found) if the cart or product is not found.
    - **Body**: An object with a `result` property containing "OK" to indicate successful removal.