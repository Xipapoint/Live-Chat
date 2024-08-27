

export interface IMessageFieldsWithReplyResponse{
    _id: string,
    replyMessageId?: string,
    onReplyMessageText?: string,
    onReplyMessageFirstName?: string,
    onReplyMessageLastName?: string,
    roomId: string, 
    userId: string,
    message: string;
    timestamp: Date | ' ';
}