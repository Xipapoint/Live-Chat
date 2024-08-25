import { useState, useEffect, useRef } from "react";
import { NotificationContext } from "../contexts/NotificationContext";
import { useAppSelector } from "../shared/hooks/redux";
import { INotification } from "../models/notification/notification.interface";

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const auth = useAppSelector(state => state.auth)
    const userId = auth.userId
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
      const ws = new WebSocket(`ws://localhost:5002?userId=${userId}`);
      wsRef.current = ws;
      
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
    }, [userId]);
  
    return (
      <NotificationContext.Provider value={{ notifications }}>
        {children}
      </NotificationContext.Provider>
    );
};