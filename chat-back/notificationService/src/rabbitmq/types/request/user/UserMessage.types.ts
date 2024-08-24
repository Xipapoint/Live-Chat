import { BaseMessage } from "../BaseMessage.type";

export interface GetNamesRequestMessage extends BaseMessage {
    serviceType: 'getNames';
    data: {
      id: string;
    };
}