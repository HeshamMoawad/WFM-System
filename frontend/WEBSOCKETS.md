# WebSocket API Documentation

This document outlines the WebSocket API endpoints available for the WhatsApp Service. These endpoints allow frontend applications to interact with WhatsApp functionality in real-time.

## Connection

The WebSocket endpoint is available at the root path of the application.

## Events

### Client Initialization

#### `initialize`
Initialize a new WhatsApp client instance.

**Request:**
```json
{
  "clientId": "string"
}
```

**Response Events:**
- `qr`: Emitted when a QR code is generated for authentication
- `ready`: Emitted when the client is ready
- `authenticated`: Emitted when the client is successfully authenticated
- `auth_failure`: Emitted when authentication fails
- `disconnected`: Emitted when the client disconnects

### Chat Management

#### `chats`
Retrieve the list of chats for a specific client.

**Request:**
```json
{
  "clientId": "string"
}
```

**Response:**
```json
{
  "chats": [Array of chat objects]
}
```

#### `archiveChat`
Archive or unarchive a specific chat.

**Request:**
```json
{
  "clientId": "string",
  "chatId": "string",
  "archived": "boolean" // true to archive, false to unarchive
}
```

**Response:**
```json
{
  "result": {
    "success": "boolean",
    "chatId": "string",
    "archived": "boolean"
  }
}
```

### Message Handling

#### `sendMessage`
Send a message to a specific contact/chat.

**Request:**
```json
{
  "clientId": "string",
  "to": "string", // phone number or chat ID
  "message": "string"
}
```

**Response:**
```json
{
  "result": "message object"
}
```

#### `getChatMessages`
Retrieve messages from a specific chat.

**Request:**
```json
{
  "clientId": "string",
  "chatId": "string"
}
```

**Response:**
```json
{
  "chatId": "string",
  "messages": [Array of message objects]
}
```

### Contact Management

#### `getContacts`
Retrieve the list of contacts for a specific client.

**Request:**
```json
{
  "clientId": "string"
}
```

**Response:**
```json
{
  "contacts": [Array of contact objects]
}
```

## Events Emitted by Server

The server emits the following events to connected clients:

- `qr`: Contains QR code data for authentication
- `ready`: Indicates the client is ready
- `authenticated`: Indicates successful authentication
- `auth_failure`: Contains error message for authentication failure
- `disconnected`: Indicates client disconnection
- `newMessage`: Contains message data when a new message is received
- `chats`: Contains updated chats data
- `sendMessage`: Contains result of sent message
- `getChatMessages`: Contains chat messages
- `getContacts`: Contains contacts data
- `archiveChat`: Contains result of archive/unarchive operation
- `error`: Contains error information

## Example Usage

```javascript
const socket = io('http://localhost:3000');

// Initialize client
socket.emit('initialize', { clientId: 'my-client-id' });

// Get chats
socket.emit('chats', { clientId: 'my-client-id' });

// Archive a chat
socket.emit('archiveChat', { 
  clientId: 'my-client-id', 
  chatId: 'chat-id', 
  archived: true 
});

// Listen for events
socket.on('chats', (data) => {
  console.log('Chats updated:', data.chats);
});

socket.on('qr', (data) => {
  console.log('QR code received:', data.qr);
});
```