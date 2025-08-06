import { Message } from "whatsapp-web.js";

// Extend the whatsapp-web.js Message type to include properties that are
// available at runtime but not in the base type definitions.
export interface AppMessage extends Message {
    _data: any;
    quotedMsg?: AppMessage;
}
