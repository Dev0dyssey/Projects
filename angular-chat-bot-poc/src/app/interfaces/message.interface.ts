export interface Message {
    sender: string;
    message: string | "No message received";
    timestamp: Date;
}