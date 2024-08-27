
export interface IMessageWithReplyResponse{
    _id: string,
    replyMessage: string,
    onReplyMessageText: string,
    roomId: string, 
    userId: string,
    message: string;
    timestamp: Date | ' ';
}