# React Integration Guide for `wa-service`

This guide provides instructions for the frontend team on how to integrate a React application with the `wa-service` backend using Socket.IO.

## 1. Setting up the Connection

First, you need to install the `socket.io-client` library:

```bash
npm install socket.io-client
```

Then, you can establish a connection to the backend:

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3000"); // Replace with your backend URL

socket.on("connect", () => {
  console.log("Connected to the server");
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
```

## 2. Authentication

The backend uses a UUID for authentication. You need to provide the UUID as a query parameter when connecting to the server. The server will validate the UUID and if it is invalid, the connection will be rejected.

```javascript
const socket = io("http://localhost:3000", {
  query: {
    uuid: "YOUR_USER_UUID", // Replace with the actual user UUID
  },
});
```

**Note on CORS:** The backend is configured to only accept connections from a specific frontend URL. Make sure the `FRONTEND_URL` environment variable is set correctly in the backend's `.env` file.

## 3. WebSocket Events

This section details the WebSocket events you can emit from the client and the events you should listen for from the server.

### 3.1. Emitting Events (Client to Server)

#### `init`

Initializes the WhatsApp client for a specific phone number.

- **Event:** `init`
- **Payload:**
  ```javascript
  {
    phone: "PHONE_NUMBER", // The phone number to initialize
    name: "CLIENT_NAME", // A name for the client
    uuid: "USER_UUID" // The user's UUID
  }
  ```
- **Example:**
  ```javascript
  socket.emit("init", { phone: "1234567890", name: "MyClient", uuid: "user-123" });
  ```

#### `logout`

Logs out the WhatsApp client.

- **Event:** `logout`
- **Example:**
  ```javascript
  socket.emit("logout");
  ```

#### `getChatMessages`

Retrieves messages from a specific chat.

- **Event:** `getChatMessages`
- **Payload:**
  ```javascript
  {
    chatId: "CHAT_ID", // The ID of the chat
    limit: 50, // Optional: The number of messages to retrieve
    fromMe: false // Optional: Whether to retrieve messages from the user
  }
  ```
- **Example:**
  ```javascript
  socket.emit("getChatMessages", { chatId: "1234567890@c.us", limit: 50 });
  ```

#### `sendMessage`

Sends a message to a specific chat.

- **Event:** `sendMessage`
- **Payload:**
  ```javascript
  {
    to: "CHAT_ID", // The ID of the chat to send the message to
    message: "Hello, world!" // The message content
  }
  ```
- **Example:**
  ```javascript
  socket.emit("sendMessage", { to: "1234567890@c.us", message: "Hello!" });
  ```

#### Other Events

The following events are also available. They all take a `chatId` or `contactId` in the payload.

- `syncChats`
- `pinChat`
- `archiveChat`
- `unarchiveChat`
- `listChats`
- `getProfilePic`
- `getContactById`
- `muteChat`
- `unmuteChat`
- `blockContact`
- `unblockContact`
- `markChatAsRead`
- `markChatAsSeen`
- `markChatAsUnread`
- `createGroup`

### 3.2. Listening for Events (Server to Client)

#### `qr`

Fired when a QR code is available for scanning.

- **Event:** `qr`
- **Payload:** `string` (The QR code as a string)
- **Example:**
  ```javascript
  socket.on("qr", (qr) => {
    // Display the QR code to the user
  });
  ```

#### `init`

Fired when the WhatsApp client has been initialized.

- **Event:** `init`
- **Payload:**
  ```javascript
  {
    success: true,
    chats: [], // An array of chat objects
    contacts: [] // An array of contact objects
  }
  ```
- **Example:**
  ```javascript
  socket.on("init", (data) => {
    if (data.success) {
      console.log("Client initialized successfully");
    } else {
      console.error("Initialization failed:", data.error);
    }
  });
  ```

#### `getChatMessages`

Fired in response to the `getChatMessages` event.

- **Event:** `getChatMessages`
- **Payload:**
  ```javascript
  {
    success: true,
    messages: [] // An array of message objects
  }
  ```
- **Example:**
  ```javascript
  socket.on("getChatMessages", (data) => {
    if (data.success) {
      // Process the messages
    }
  });
  ```

#### `new_message`

Fired when a new message is received.

- **Event:** `new_message`
- **Payload:** `object` (The message object)
- **Example:**
  ```javascript
  socket.on("new_message", (message) => {
    // Add the new message to the chat
  });
  ```

#### `message_sent`

Fired when a message has been successfully sent.

- **Event:** `message_sent`
- **Payload:** `object` (The sent message object)
- **Example:**
  ```javascript
  socket.on("message_sent", (message) => {
    // Update the UI to show the message as sent
  });
  ```

#### `message_error`

Fired when there is an error sending a message.

- **Event:** `message_error`
- **Payload:**
  ```javascript
  {
    success: false,
    error: "ERROR_MESSAGE"
  }
  ```
- **Example:**
  ```javascript
  socket.on("message_error", (error) => {
    console.error("Failed to send message:", error.error);
  });
  ```

#### Other Events

You should also listen for the corresponding response events for the other client-to-server events you emit (e.g., `sync_chats`, `pinChat`, etc.). These events will typically have a payload with a `success` property and, if `success` is `true`, the requested data.