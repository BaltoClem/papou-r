## Route: /carts

### Description

This route handles operations related to carts, including retrieving a list of carts, retrieving the current user's cart, creating a new cart, deleting a cart, and updating a cart. Access to these operations is restricted to admin users.

### Middleware

- `adminAuth`: This middleware function allows only admin users to access the route.

### Helper Functions

- `getCart`: This function retrieves a cart based on the UUID and user ID.
- `checkCartExistence`: This function checks the existence of a cart based on the UUID and user ID.

### Route Handlers

#### GET /carts

- **Description**: Retrieves a paginated list of carts.
- **Middleware**: `adminAuth`
- **Request query parameters**:
  - `limit` (optional): The maximum number of carts to retrieve per page.
  - `page` (optional): The page number to retrieve.
  - `orderField` (optional): The field to use for ordering the carts.
  - `order` (optional): The order direction (asc or desc) for the ordering.
  - `filterField` (optional): The field to use for filtering the carts.
  - `filter` (optional): The value to filter the carts.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An object with a `result` property containing the paginated list of carts.

#### GET /cart

- **Description**: Retrieves the current user's cart.
- **Middleware**: `softAuth`
- **Response**:
  - **Status**: 200 (OK) if the cart is found and has products, 404 (Not Found) otherwise.
  - **Body**: An object with a `result` property containing the retrieved cart, including its ID, active status, session UUID, user ID, products, and price.

#### POST /cart

- **Description**: Creates a new cart.
- **Middleware**: `softAuth`
- **Response**:
  - **Status**: 201 (Created) if the cart is created successfully, 409 (Conflict) if a cart already exists for the user.
  - **Body**: An object with a `result` property containing the newly created cart.

#### DELETE /cart/:cartId

- **Description**: Deletes a cart.
- **Middleware**: `auth`
- **Request parameters**:
  - `cartId`: The ID of the cart to delete.
- **Response**:
  - **Status**: 200 (OK) if the cart is found and deleted successfully, 404 (Not Found) otherwise.
  - **Body**: An object with a `result` property containing the deleted cart.

#### PATCH /cart/:cartId

- **Description**: Updates a cart.
- **Middleware**: `auth`
- **Request parameters**:
  - `cartId`: The ID of the cart to update.
- **Response**:
  - **Status**: 200 (OK) if the cart is found and updated successfully, 404 (Not Found) otherwise.
  - **Body**: An object with a `result` property containing the updated cart.