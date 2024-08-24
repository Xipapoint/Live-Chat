import { createContext } from "react";
import { INotification } from "../models/notification/notification.interface";

export interface NotificationContextType {
    notifications: INotification[];
}
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);
  