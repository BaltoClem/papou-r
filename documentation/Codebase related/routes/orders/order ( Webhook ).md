## Route: /order/webhook

### Description

This route handles webhook events related to orders. It receives webhook events from Stripe and updates the corresponding order status based on the event.

### External Dependencies

- `stripe`: This module is used to interact with the Stripe API for handling webhook events.

### Route Handlers

#### POST /order/webhook

- **Description**: Handles the webhook event from Stripe and updates the corresponding order status.
- **Request body**: The raw payload of the webhook event.
- **Request headers**:
  - `stripe-signature`: The signature of the webhook event.
- **Response**:
  - **Status**: 200 (OK) if the webhook event is processed successfully, 400 (Bad Request) if there is an error with the webhook event.
  - **Body**: No response body.

#### Webhook Event Handling

- **Checkout Session Events**: If the webhook event type is "checkout.session", the corresponding order status is updated based on the session status received from Stripe. The order is retrieved using the session ID, and the status field of the order is updated with the session status.
- **Response**: The webhook handler responds with a 200 (OK) status to acknowledge the successful processing of the webhook event.