# Minimal MCP Runtime (Node.js + Express)

A minimal backend runtime for registering and executing MCP-like tools.

## File structure

```
.
├── package.json
└── src
    ├── server.js
    └── toolRegistry.js
```

## Requirements

- Node.js 18+

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm start
```

Server runs on `http://localhost:3000` by default.

## API

### `POST /tools/register`
Registers a tool (in-memory).

Request body:

```json
{
  "name": "myTool",
  "description": "Example tool",
  "inputSchema": {
    "type": "object",
    "properties": {
      "text": { "type": "string" }
    },
    "required": ["text"]
  }
}
```

Response:

```json
{
  "success": true,
  "tool": {
    "name": "myTool",
    "description": "Example tool",
    "inputSchema": {
      "type": "object",
      "properties": {
        "text": { "type": "string" }
      },
      "required": ["text"]
    }
  }
}
```

> Note: Registered tools via API use a default execute behavior that returns `{ "ok": true, "input": ... }`.

### `POST /tools/execute`
Executes a tool by name with input.

Request body:

```json
{
  "name": "echo",
  "input": {
    "message": "hello"
  }
}
```

Response:

```json
{
  "success": true,
  "tool": "echo",
  "output": {
    "message": "hello"
  }
}
```

## Built-in example tool

- `echo`
  - input: `{ "message": "string" }`
  - output: `{ "message": "string" }`
