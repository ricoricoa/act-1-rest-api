# Simple CRUD REST API

A minimal Node.js + Express backend implementing a REST API with GET, POST, PUT, and DELETE operations.

## Endpoints

- `GET /items` - list all items
- `GET /items/names` - list item names only
- `GET /items/name/:name` - list items matching a name
- `GET /items/:id` - get one item by id
- `POST /items` - create a new item
- `PUT /items/:id` - update an existing item
- `DELETE /items/:id` - delete an item

## Run

1. Install dependencies:

```bash
npm install
```

2. Start the server:

```bash
npm start
```

3. Open `http://localhost:3000`

## Example item body

```json
{
  "name": "Example item",
  "description": "A short description"
}
```
