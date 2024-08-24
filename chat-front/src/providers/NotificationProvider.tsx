import { useState, useEffect } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import { useAppSelector } from "../shared/hooks/redux";
import { INotification } from "../models/notification/notification.interface";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const auth = useAppSelector(state => state.auth)
    const userId = auth.userId
  
    useEffect(() => {
      const ws = new WebSocket(`ws://localhost:5002?userId=${userId}`);
      
      ws.onopen = () => {
        console.log('Connected to notification WebSocket');
      };
      ws.onmessage = (event) => {
        const newNotification: INotification = JSON.parse(event.data);
        console.log("new notification: ", newNotification);
        
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
      };
  
      ws.onclose = () => {
        console.log('WebSocket notification connection closed');
      };
  
      return () => {
        ws.close();
      };
    });
  
    return (
      <NotificationContext.Provider value={{ notifications }}>
        {children}
      </NotificationContext.Provider>
    );
};