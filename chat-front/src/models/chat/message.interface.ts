export interface IMessage{
    _id: string, 
    roomId: string, 
    userId: string,
    message: string;
    timestamp: Date | ' ';
  }