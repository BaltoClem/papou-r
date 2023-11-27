## Route: /category

### Description

This route handles operations related to categories. It allows retrieving a paginated list of categories, creating a new category, and updating/deleting an existing category. Access to these operations is restricted to admin users.

### Middleware

- `adminAuth`: This middleware function allows only admin users to access the route.
- `validate`: This middleware function validates the request body and parameters using the provided validation schema.

### Helper Functions

- `totalPages`: This helper function calculates the total number of pages based on the total number of categories and the specified limit.

### Route Handlers

#### GET /category

- **Description**: Retrieves a paginated list of categories.
- **Request query parameters**:
  - `limit` (optional): The maximum number of categories to retrieve per page.
  - `page` (optional): The page number to retrieve.
  - `orderField` (optional): The field to use for ordering the categories.
  - `order` (optional): The order direction (asc or desc) for the ordering.
  - `filterField` (optional): The field to use for filtering the categories.
  - `filter` (optional): The value to filter the categories.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An object with a `result` property containing the paginated list of categories and a `totalPages` property indicating the total number of pages.

#### GET /category/:categoryId

- **Description**: Retrieves a single category by ID.
- **Request parameters**:
  - `categoryId`: The ID of the category to retrieve.
- **Response**:
  - **Status**: 200 (OK) if the category is found, 404 (Not Found) if the category is not found.
  - **Body**: An object with a `result` property containing the retrieved category.

#### POST /category

- **Description**: Creates a new category.
- **Middleware**: `adminAuth`, `validate`
- **Request body**:
  - `name`: The name of the category (required).
  - `slug`: The slug of the category (optional).
  - `description`: The description of the category (required).
  - `image_url`: The URL of the category image (required).
- **Response**:
  - **Status**: 201 (Created) if the category is created successfully, 409 (Conflict) if a category with the same slug already exists.
  - **Body**: An object with a `result` property containing the created category.

#### PATCH /category/:categoryId

- **Description**: Updates an existing category.
- **Middleware**: `adminAuth`, `validate`
- **Request parameters**:
  - `categoryId`: The ID of the category to update.
- **Request body**:
  - `name`: The updated name of the category.
  - `slug`: The updated slug of the category.
  - `description`: The updated description of the category.
  - `image_url`: The updated URL of the category image.
- **Response**:
  - **Status**: 200 (OK) if the category is found and updated successfully, 404 (Not Found) if the category is not found, 409 (Conflict) if a category with the same slug already exists.
  - **Body**: An object with a `result` property containing the updated category.

#### DELETE /category/:categoryId

- **Description**: Deletes an existing category.
- **Middleware**: `adminAuth`, `validate`
- **Request parameters**:
  - `categoryId`: The ID of the category to delete.
- **Response**:
  - **Status**: 200 (OK) if the category is found and

 deleted successfully, 404 (Not Found) if the category is not found.
  - **Body**: An object with a `result` property containing the string "OK" to indicate a successful deletion.