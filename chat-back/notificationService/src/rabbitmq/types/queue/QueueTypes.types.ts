import { ServiceMessage } from "../request";

type QueueMapping = {
  setNotificationUserMessage: string
  getNames: string
};
type Queue<T extends ServiceMessage> = { queue: QueueMapping[T['serviceType']] };
  
export function addQueueToMessage<T extends ServiceMessage>(message: T): Queue<T> {
    const queueMapping: QueueMapping = {
      setNotificationUserMessage: 'notificationQueue',
      getNames: 'userQueue'
    };
  
    return {
      queue: queueMapping[message.serviceType],
    };
}

// import { BaseMessage } from "./requestTypes";

// export interface UserQueueMessage extends BaseMessage {
//     queue: 'userQueue';
//   }
  
//   export interface NotificationQueueMessage extends BaseMessage {
//     queue: 'notificationQueue';
//   }

