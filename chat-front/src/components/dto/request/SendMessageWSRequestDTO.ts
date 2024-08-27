export interface ISendMessageWSRequestDTO {
    roomId: string;
    userId: string;
    message: string;
    replyingMessageId?: string,
    isReplying: boolean
  }