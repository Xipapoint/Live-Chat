import React from 'react';
import styles from './ChatCard.module.scss';
import { DATE_TYPE } from './date.types';

interface ChatCardProps{
    avatarUrl: string,
    firstName: string,
    lastName: string,
    date: Date,
    message: string
    
}

function defineWeekDay(dayNumber: number, messageHours: string){
  const visualDate: string = dayNumber === 0 ? 'Today, ' + messageHours : 
  DATE_TYPE[dayNumber] + ', ' + messageHours
  return visualDate
}

const ChatCard: React.FC<ChatCardProps> = ({ avatarUrl, firstName, lastName, date, message }) => {
  const messageDate = new Date(date);
  const currentDate = new Date();
  console.log(date);
  

  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const messageHours = date.toString().slice(11,16);
  const messageDay = messageDate.getDate();
  const messageMonth = messageDate.getMonth();
  const messageYear = messageDate.getFullYear();

  const differenceMonth = currentMonth - messageMonth;
  const differenceDay = currentDay - messageDay;

  const visualDate = differenceMonth > 1 && differenceDay > 7 ? messageYear : defineWeekDay(differenceDay, messageHours)
  

  return(
    <div className={styles.card}>
      <img src={avatarUrl} alt={`${firstName} ${lastName}`} className={styles.avatar} />
      <div className={styles.content}>
        <div className={styles.info}>
          <h3>{`${firstName} ${lastName}`}</h3>
        </div>
        <div className={styles.message}>
          <p className={styles.text}>{message}</p>
          <p className={styles.date}>{visualDate}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;