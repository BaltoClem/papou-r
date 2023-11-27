
## Table: users

- Columns:
    - id: INTEGER (Primary Key)
    - display_name: TEXT
    - email: TEXT (Not Nullable, Unique)
    - password_hash: TEXT (Not Nullable)
    - password_salt: TEXT (Not Nullable)
    - phone_number: TEXT
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP
    - deleted: BOOLEAN (Default: 0)
    - confirmed: BOOLEAN (Default: 0)

## Table: roles

- Columns:
    - id: INTEGER (Primary Key)
    - name: TEXT (Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: user__roles

- Columns:
    - id: INTEGER (Primary Key)
    - role_id: INTEGER (Foreign Key referencing roles.id, Not Nullable)
    - user_id: INTEGER (Foreign Key referencing users.id, Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: addresses

- Columns:
    - id: INTEGER (Primary Key)
    - user_id: INTEGER (Foreign Key referencing users.id, Not Nullable)
    - street_name: TEXT (Not Nullable)
    - zipcode: INTEGER (Not Nullable)
    - city: TEXT (Not Nullable)
    - country: TEXT (Not Nullable)
    - complement: TEXT
    - in_use: BOOLEAN
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP
    - fullname: TEXT (Not Nullable)

## Table: dimensions

- Columns:
    - id: INTEGER (Primary Key)
    - width: INTEGER (Not Nullable)
    - height: INTEGER (Not Nullable)
    - length: STRING (Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: products

- Columns:
    - id: INTEGER (Primary Key)
    - name: TEXT (Not Nullable)
    - price: INTEGER (Not Nullable)
    - description: TEXT (Not Nullable)
    - stock: INTEGER (Not Nullable)
    - dimension_id: INTEGER (Foreign Key referencing dimensions.id, Not Nullable)
    - deleted: BOOLEAN (Default: 0)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: materials

- Columns:
    - id: INTEGER (Primary Key)
    - name: TEXT (Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: product__materials

- Columns:
    - id: INTEGER (Primary Key)
    - material_id: INTEGER (Foreign Key referencing materials.id, Not Nullable)
    - product_id: INTEGER (Foreign Key referencing products.id, Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: categories

- Columns:
    - id: INTEGER (Primary Key)
    - name: TEXT (Not Nullable)
    - description: TEXT (Not Nullable)
    - slug: TEXT (Not Nullable)
    - image_url: TEXT (Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: product__categories

- Columns:
    - id: INTEGER (Primary Key)
    - product_id: INTEGER (Foreign Key referencing products.id, Not Nullable)
    - category_id: INTEGER (Foreign Key referencing categories.id, Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: comments

- Columns:
    - id: INTEGER (Primary Key)
    - user_id: INTEGER (Foreign Key referencing users.id, Not Nullable)
    - product_id: INTEGER (Foreign Key referencing products.id, Not Nullable)
    - content: TEXT (Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: carts

- Columns:
    - id: INTEGER (Primary Key)
    - user_id: INTEGER (Foreign Key referencing users.id, Nullable)
    - is_active: BOOLEAN
    - session_uuid: STRING (Unique)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: cart__products

- Columns:
    - id: INTEGER (Primary Key)
    - cart_id: INTEGER (Foreign Key referencing carts.id, Not Nullable)
    - product_id: INTEGER (Foreign Key referencing products.id, Not Nullable)
    - quantity: INTEGER (Not Nullable)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: orders

- Columns:
    - id: INTEGER (Primary Key)
    - address_id: INTEGER (Foreign Key referencing addresses.id, Not Nullable)
    - cart_id: INTEGER (Foreign Key referencing carts.id, Not Nullable)
    - status: TEXT (Not Nullable)
    - session_id: STRING (Not Nullable)
    - payment_intent: STRING
    - deleted: BOOLEAN (Default: 0)
    - created_at: TIMESTAMP
    - updated_at: TIMESTAMP

## Table: carousel

- Columns:
    - image_url: TEXT (Not Nullable, Unique)

## Table: contact_messages

- Columns:
    - id: INTEGER (Primary Key)
    - email: TEXT (Not Nullable)
    - title: TEXT (Not Nullable)
    - text: TEXT (Not Nullable)

## Table: images

- Columns:
    - id: INTEGER (Primary Key)
    - url: TEXT (Not Nullable)
    - slug: STRING (Unique)

Note: The "images" table is not explicitly defined in the migration code you provided, so please ensure it exists and is related to other tables appropriately.

# Relationships

- The "users" table has a one-to-many relationship with the "user__roles" table through the "id" column.
- The "users" table has a one-to-many relationship with the "addresses" table through the "id" column.
- The "roles" table has a one-to-many relationship with the "user__roles" table through the "id" column.
- The "products" table has a one-to-one relationship with the "dimensions" table through the "dimension_id" column.
- The "products" table has a many-to-many relationship with the "materials" table through the "product__materials" table.
- The "products" table has a many-to-many relationship with the "categories" table through the "product__categories" table.
- The "users" table has a one-to-many relationship with the "comments" table through the "id" column.
- The "users" table has a one-to-many relationship with the "carts" table through the "id" column.
- The "carts" table has a one-to-many relationship with the "cart__products" table through the "id" column.
- The "addresses" table has a one-to-many relationship with the "orders" table through the "id" column.
- The "carts" table has a one-to-many relationship with the "orders" table through the "id" column.