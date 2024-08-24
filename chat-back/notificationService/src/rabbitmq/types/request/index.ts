import { SetNotificationUserMessageRequestMessage } from "./notification/NotificationMessage.types";
import { GetNamesRequestMessage } from "./user/UserMessage.types";

export type ServiceMessage = SetNotificationUserMessageRequestMessage | GetNamesRequestMessage;
  