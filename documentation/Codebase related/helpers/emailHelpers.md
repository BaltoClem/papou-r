### `templateIdForgottenPassword`

The template ID for the forgotten password email.

### `templateIdConfirmationMail`

The template ID for the confirmation email.

### `signJWTForUser(user)`

Generates a JSON Web Token (JWT) for the given user.

- **Parameters**:
    - `user`: The user object for which the JWT is generated.

### `generateDynamicTemplateEmailForUserByTemplateID(templateId, email, jwt)`

Generates a dynamic email template for a user using the specified template ID, email address, and JWT.

- **Parameters**:
    - `templateId`: The ID of the email template.
    - `email`: The recipient's email address.
    - `jwt`: The JSON Web Token to include in the email template.

### `sendEmailTemplate(template, res)`

Sends an email using the specified template.

- **Parameters**:
    - `template`: The email template to send.
    - `res`: The response object.

Note: This function relies on the `SENDGRID_API_KEY` environment variable to be set.