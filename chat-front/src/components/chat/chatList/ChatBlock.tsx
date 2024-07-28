import React from 'react';
import styles from './ChatBlock.module.scss';

interface ChatBlockProps{
    avatarUrl: string,
    firstName: string,
    lastName: string,
    date: string,
    message: string
}

const ChatBlock: React.FC<ChatBlockProps> = ({ avatarUrl, firstName, lastName, date, message }) => {
  return (
    <div className={styles.block}>
      <img src={avatarUrl} alt={`${firstName} ${lastName}`} className={styles.avatar} />
      <div className={styles.content}>
        <div className={styles.info}>
          <h3>{`${firstName} ${lastName}`}</h3>
          <p>{new Date(date).toLocaleString()}</p>
        </div>
        <div className={styles.text}>
          <p>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatBlock;