// import { UserQueueMessage, NotificationQueueMessage } from "./QueueTypes";
// import { BaseMessage } from "./requestTypes";

// export function createUserMessage<T extends BaseMessage>(message: T): T & UserQueueMessage {
//     return {
//       ...message,
//       queue: 'userQueue',
//     };
//   }
  
// export  function createNotificationMessage<T extends BaseMessage>(message: T): T & NotificationQueueMessage {
//     return {
//       ...message,
//       queue: 'notificationQueue',
//     };
//   }