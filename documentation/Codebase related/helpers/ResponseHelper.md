### `adminOrSelfAuth(res, user, idParam)`

Checks if the user has administrative privileges or if the user is accessing their own resource. If the user does not have sufficient permission, an error response is sent.

- **Parameters**:
    - `res`: The response object.
    - `user`: The user object representing the authenticated user.
    - `idParam`: The ID parameter indicating the resource ID.

### `isUserAdmin(user)`

Checks if the user has the "admin" role.

- **Parameters**:
    - `user`: The user object to check.

### `alreadyExistsError(res, err = "E.ALREADY_EXISTS")`

Sends a 409 Conflict status code with an error message indicating that the requested resource already exists.

- **Parameters**:
    - `res`: The response object.
    - `err` (optional): The error message to send. Default value is "E.ALREADY_EXISTS".

### `insufficientPermissionError(res, err = "E.INSUFFICIENT_PERMISSION")`

Sends a 403 Forbidden status code with an error message indicating that the user has insufficient permission to access the requested resource.

- **Parameters**:
    - `res`: The response object.
    - `err` (optional): The error message to send. Default value is "E.INSUFFICIENT_PERMISSION".

### `internalError(res, err = "E.INTERNAL_ERROR")`

Sends a 500 Internal Server Error status code with an error message indicating an internal server error.

- **Parameters**:
    - `res`: The response object.
    - `err` (optional): The error message to send. Default value is "E.INTERNAL_ERROR".

### `notFoundError(res, err = "E.NOT_FOUND")`

Sends a 404 Not Found status code with an error message indicating that the requested resource was not found.

- **Parameters**:
    - `res`: The response object.
    - `err` (optional): The error message to send. Default value is "E.NOT_FOUND".

### `uploadError(res, err = "E.UPLOAD_ERROR")`

Sends a 500 Internal Server Error status code with an error message indicating an error during file upload.

- **Parameters**:
    - `res`: The response object.
    - `err` (optional): The error message to send. Default value is "E.UPLOAD_ERROR".

### `conflictsError(res, err = "E.CONFLICTS")`

Sends a 409 Conflict status code with an error message indicating a conflict.

- **Parameters**:
    - `res`: The response object.
    - `err` (optional): The error message to send. Default value is "E.CONFLICTS".