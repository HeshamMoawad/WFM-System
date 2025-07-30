import { Chat , WAMessage } from "@whiskeysockets/baileys";

export interface ResponseChat {
    phone:string,
    chat: Chat
}

export type ResponseChatType = ResponseChat[]

export interface ResponseChatMessage {
    phone: string,
    message: WAMessage,
    chat:string 
}
export type ResponseChatMessageType = ResponseChatMessage[]


export enum Status {
    ERROR = 0,
    PENDING = 1,
    SERVER_ACK = 2,
    DELIVERY_ACK = 3,
    READ = 4,
    PLAYED = 5
}
