import React, { useEffect, useState } from 'react';
import { useNotifications } from '../../shared/hooks/notifications';
import styles from './NotificationModal.module.scss';
import { INotification } from '../../models/notification/notification.interface';



const NotificationModal: React.FC = () => {
  const { notifications } = useNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [latestNotification, setLatestNotification] = useState<INotification>();

  useEffect(() => {
    if (notifications.length > 0) {
      
      const lastNotification = notifications[notifications.length - 1];
      setLatestNotification(lastNotification as INotification);
      setIsVisible(true);

      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications]);

  if (!isVisible || !latestNotification) {
    return null;
  }

  return (
    <div className={styles.notificationModal}>
      <div className={styles.notificationContent}>
        <div style={{display: 'flex'}}>
            <h4>{latestNotification.senderFirstName}</h4>
            <h4>{latestNotification.senderLastName}</h4>
        </div>
        <p>{latestNotification.content}</p>
        <button onClick={() => setIsVisible(false)}>Закрыть</button>
      </div>
    </div>
  );
};

export default NotificationModal;