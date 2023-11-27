## Route: /address

### Description

This route handles operations related to addresses, including retrieving address records, retrieving a specific address record, creating a new address record, updating an address record, and deleting an address record. The route requires authentication before accessing the route handlers.

### Middleware

- `adminAuth`: This middleware function ensures that the user making the request is authenticated as an admin before proceeding with the route handlers. If this is called, only admin users can access this route.
- `auth`: This middleware function ensures that the user making the request is authenticated before proceeding with the route handlers. If this is called, only logged-in users can access this route.

### Route Handlers

#### GET /address

- **Description**: Retrieves a list of address records based on optional query parameters.
- **Request query parameters**:
    - `limit` (optional): The maximum number of records to retrieve per page.
    - `page` (optional): The page number to retrieve.
    - `orderField` (optional): The field to use for ordering the records.
    - `address` (optional): The order direction (asc or desc) for the ordering.
    - `filterField` (optional): The field to use for filtering the records.
    - `filter` (optional): The value to filter the records.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the retrieved records.

#### GET /address/:addressId

- **Description**: Retrieves a specific address record identified by `addressId`.
- **Request parameters**:
    - `addressId`: The ID of the address record to retrieve.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the retrieved address record.

#### POST /address

- **Description**: Creates a new address record.
- **Request body**:
    - `fullname`: The full name associated with the address.
    - `street_name`: The street name of the address.
    - `zipcode`: The zip code of the address.
    - `city`: The city of the address.
    - `country`: The country of the address.
    - `complement`: Additional information or complement about the address.
    - `user_id`: The ID of the user associated with the address.
- **Response**:
    - **Status**: 201 (Created)
    - **Body**: An object with a `result` property containing the newly created address record.

#### PATCH /address/:addressId

- **Description**: Updates an existing address record identified by `addressId`.
- **Request parameters**:
    - `addressId`: The ID of the address record to update.
- **Request body** (optional):
    - `fullname`: The updated full name associated with the address.
    - `street_name`: The updated street name of the address.
    - `zipcode`: The updated zip code of the address.
    - `city`: The updated city of the address.
    - `country`: The updated country of the address.
    - `complement`: The updated additional information or complement about the address.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the updated address record.

#### DELETE /address/:addressId

- **Description**: Deletes an existing address record identified by `addressId`.
- **Request parameters**:
    - `addressId`: The ID of the address record to delete.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property indicating

 a successful deletion ("OK").