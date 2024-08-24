import { BaseMessage } from "../BaseMessage.type";

export interface SetNotificationUserMessageRequestMessage extends BaseMessage {
    serviceType: 'setNotificationUserMessage';
    data: {
        message: string,
        userId: string
    };
}