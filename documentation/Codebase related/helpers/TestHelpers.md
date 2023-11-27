### `loginAsAdmin()`

Logs in as an admin user and returns the response.

### `loginAsWanted(email, password)`

Logs in as a user with the specified email and password and returns the response.

- **Parameters**:
    - `email`: The email of the user.
    - `password`: The password of the user.

### `loginAsUser()`

Logs in as a regular user and returns the response.

### `expectInvalidAuth(res, errorMsg = "E.INVALID.AUTH")`

Expects that the response has a 403 Forbidden status code with an error message indicating invalid authentication.

- **Parameters**:
    - `res`: The response object.
    - `errorMsg` (optional): The expected error message. Default value is "E.INVALID.AUTH".

### `expectInsufficientPermission(res, errorMsg = "E.INSUFFICIENT_PERMISSION")`

Expects that the response has a 403 Forbidden status code with an error message indicating insufficient permission.

- **Parameters**:
    - `res`: The response object.
    - `errorMsg` (optional): The expected error message. Default value is "E.INSUFFICIENT_PERMISSION".

### `expect404(res, errorMsg = "E.NOT_FOUND")`

Expects that the response has a 404 Not Found status code with an error message indicating the requested resource was not found.

- **Parameters**:
    - `res`: The response object.
    - `errorMsg` (optional): The expected error message. Default value is "E.NOT_FOUND".

### `expect409(res, errorMsg = "E.ALREADY_EXISTS")`

Expects that the response has a 409 Conflict status code with an error message indicating that the requested resource already exists.

- **Parameters**:
    - `res`: The response object.
    - `errorMsg` (optional): The expected error message. Default value is "E.ALREADY_EXISTS".

### `expectInternalError(res, errorMsg = "E.INTERNAL_ERROR")`

Expects that the response has a 500 Internal Server Error status code with an error message indicating an internal server error.

- **Parameters**:
    - `res`: The response object.
    - `errorMsg` (optional): The expected error message. Default value is "E.INTERNAL_ERROR".