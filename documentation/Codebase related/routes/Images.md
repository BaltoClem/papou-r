## Route: /image

### Description

This route handles operations related to images, including retrieving image records, retrieving a specific image record, creating new image records, updating an image record, and deleting an image record. The route requires authentication as an admin for accessing certain route handlers.

### Middleware

- `adminAuth`: This middleware function ensures that the user making the request is authenticated as an admin before proceeding with the route handlers. Only admin users can access the restricted routes.
- `uploadImage`: This middleware function handles the uploading of images to an S3 bucket.
- `deleteImage`: This middleware function handles the deletion of images from an S3 bucket.
- `validate`: This middleware function validates the request parameters based on specified validation rules.

### Route Handlers

#### GET /image

- **Description**: Retrieves a list of image records based on optional query parameters.
- **Request query parameters**:
    - `limit` (optional): The maximum number of records to retrieve per page.
    - `page` (optional): The page number to retrieve.
    - `orderField` (optional): The field to use for ordering the records.
    - `order` (optional): The order direction (asc or desc) for the ordering.
    - `filterField` (optional): The field to use for filtering the records.
    - `filter` (optional): The value to filter the records.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the retrieved records.

#### GET /image/:imageId

- **Description**: Retrieves a specific image record based on the provided `imageId`.
- **Request parameters**:
    - `imageId`: The ID of the image to retrieve.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the retrieved image record.

#### POST /image

- **Description**: Creates new image records by uploading image files to an S3 bucket.
- **Request body**:
    - The request should use `multipart/form-data` encoding and include one or more image files to upload.
- **Response**:
    - **Status**: 201 (Created)
    - **Body**: An object with a `result` property containing the created image records.

#### PATCH /image/:imageId

- **Description**: Updates an image record by replacing the image file with a new one.
- **Request parameters**:
    - `imageId`: The ID of the image to update.
- **Request body**:
    - The request should use `multipart/form-data` encoding and include the new image file to upload.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property containing the updated image record.

#### DELETE /image/:imageId

- **Description**: Deletes an image record and its associated image file from the S3 bucket.
- **Request parameters**:
    - `imageId`: The ID of the image to delete.
- **Response**:
    - **Status**: 200 (OK)
    - **Body**: An object with a `result` property indicating a successful deletion ("OK").