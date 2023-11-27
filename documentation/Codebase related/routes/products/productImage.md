## Route: /product/:productId/images

### Description

This route handles operations related to product images. It allows fetching the images associated with a product, updating the images associated with a product, and deleting an image from a product.

### Middleware

- `adminAuth`: This middleware ensures that only authenticated admin users can access the routes protected by it.
- `validate`: This middleware is used for request validation based on the provided validators.

### Route Handlers

#### GET /product/:productId/images

- **Description**: Fetches the images associated with a specific product.
- **Request parameters**:
  - `productId`: The ID of the product.
- **Request query parameters**:
  - `limit` (optional): The number of images to fetch per page.
  - `page` (optional): The page number of images to fetch.
  - `orderField` (optional): The field to use for ordering the images (e.g., name).
  - `order` (optional): The order direction (e.g., "asc" for ascending, "desc" for descending).
  - `filterField` (optional): The field to use for filtering the images (e.g., name).
  - `filter` (optional): The value to use for filtering the images based on the filterField.
- **Response**:
  - **Status**: 200 (OK)
  - **Body**: An array of images associated with the product.

#### PATCH /product/:productId/images

- **Description**: Updates the images associated with a specific product.
- **Request parameters**:
  - `productId`: The ID of the product.
- **Request body**:
  - `imageIds`: An array of image IDs to associate with the product.
- **Response**:
  - **Status**: 200 (OK) if the images are updated successfully, 404 (Not Found) if the product with the specified ID does not exist or if any of the provided image IDs are not found, 409 (Conflict) if any of the provided image IDs are already associated with the product.
  - **Body**: The updated product object with the associated images.

#### DELETE /product/:productId/images/:imageId

- **Description**: Deletes an image from a specific product.
- **Request parameters**:
  - `productId`: The ID of the product.
  - `imageId`: The ID of the image to delete.
- **Response**:
  - **Status**: 200 (OK) if the image is deleted successfully, 404 (Not Found) if the product with the specified ID or the image with the specified ID does not exist, 500 (Internal Server Error) if there are no images associated with the product.
  - **Body**: An object with the result "OK" if the image is deleted successfully.