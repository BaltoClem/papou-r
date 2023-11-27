## Route: /order

### Description

This route handles operations related to orders. It allows retrieving a list of orders, creating a new order, updating an existing order, and deleting an order. Access to these operations is restricted to authenticated users, with additional restrictions for admin users.

### Middleware

- `adminAuth`: This middleware function allows only admin users to access the route.
- `auth`: This middleware function ensures that the user is authenticated to access the route.
- `validate`: This middleware function validates the request body and parameters using the provided validation schema.

### Helper Functions

- `createLineItem`: This helper function creates a line item object for the Stripe checkout session based on the provided product and quantity.

### External Dependencies

- `stripe`: This module is used to interact with the Stripe API for payment processing.

### Route Handlers

#### GET /order

- **Description**: Retrieves a list of orders.
- **Middleware**: `adminAuth`
- **Request query parameters**:
  - `limit` (optional): The maximum number of orders to retrieve per page.
  - `page` (optional): The page number to retrieve.
  - `orderField` (optional): The field to use for ordering the orders.
  - `order` (optional): The order direction (asc or desc) for the ordering.
  - `filterField` (optional): The field to use for filtering the orders.
  - `filter` (optional): The value to filter the orders.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An object with a `result` property containing the list of orders.

#### GET /order/:orderId

- **Description**: Retrieves a single order by ID.
- **Middleware**: `auth`, `validate`
- **Request parameters**:
  - `orderId`: The ID of the order to retrieve.
- **Response**:
  - **Status**: 200 (OK) if the order is found, 404 (Not Found) if the order is not found or the user is not authorized to access the order.
  - **Body**: An object with a `result` property containing the retrieved order.

#### POST /order

- **Description**: Creates a new order.
- **Middleware**: `auth`, `validate`
- **Request body**:
  - `cart_id`: The ID of the cart associated with the order (required).
  - `address_id`: The ID of the address associated with the order (required).
- **Response**:
  - **Status**: 201 (Created) if the order is created successfully, 409 (Conflict) if an order with the same address and cart already exists, 400 (Bad Request) if the cart is already paid or if the cart is associated with an anonymous user, 500 (Internal Server Error) if there is an error.
  - **Body**: An object with a `result` property containing the created order and a `payment_link` property containing the URL for the payment.

#### PATCH /order/:orderId

- **Description**: Updates an existing order.
- **Middleware**: `auth`, `validate`
- **Request parameters**:
  - `orderId`: The ID of the order to update.
- **Request body**:
  - `address_id`: The updated address ID for the order.
- **Response**:
  - **Status**: 200 (OK) if the order is found and updated successfully, 404 (Not Found) if the order is not found or the user is not authorized to update the order.
  - **Body**: An object with a `result` property containing the updated order.

#### DELETE /order/:orderId

- **Description**: Deletes an existing order.
- **

Middleware**: `adminAuth`, `validate`
- **Request parameters**:
  - `orderId`: The ID of the order to delete.
- **Response**:
  - **Status**: 200 (OK) if the order is deleted successfully, 404 (Not Found) if the order is not found.