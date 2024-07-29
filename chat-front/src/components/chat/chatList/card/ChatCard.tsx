import React from 'react';
import styles from './ChatCard.module.scss';

interface ChatCardProps{
    avatarUrl: string,
    firstName: string,
    lastName: string,
    date: string,
    message: string
}

const ChatCard: React.FC<ChatCardProps> = ({ avatarUrl, firstName, lastName, date, message }) => {
  return (
    <div className={styles.card}>
      <img src={avatarUrl} alt={`${firstName} ${lastName}`} className={styles.avatar} />
      <div className={styles.content}>
        <div className={styles.info}>
          <h3>{`${firstName} ${lastName}`}</h3>
          <p>{date}</p>
        </div>
        <div className={styles.text}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;