import React from 'react';
import styles from './ChatCard.module.scss';
import { DATE_TYPE } from './date.types';

interface ChatCardProps{
    avatarUrl: string,
    name: string,
    date: Date | string,
    message: string
    
}

function defineWeekDay(dayNumber: number, messageHours: string){
  const visualDate: string = dayNumber === 0 ? 'Today, ' + messageHours : 
  DATE_TYPE[dayNumber] + ', ' + messageHours
  return visualDate
}
function initializeTimeStamp(date: Date){
  const messageDate = new Date(date);
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth();
  const messageHours = date.toString().slice(11,16);
  const messageDay = messageDate.getDate();
  const messageMonth = messageDate.getMonth() + 1;
  const messageYear = messageDate.getFullYear();
  const differenceMonth = currentMonth - messageMonth;
  const differenceDay = currentDay - messageDay;
  return{
    messageHours,
    messageDay,
    messageMonth,
    messageYear,
    differenceMonth,
    differenceDay
  }

}

const ChatCard: React.FC<ChatCardProps> = ({ avatarUrl, name, date, message }) => {
  let visualDate: string
  console.log(date);
  
  if(date === '') visualDate = ''
  else{
    const {
      messageHours,
      messageDay,
      messageMonth,
      messageYear,
      differenceMonth,
      differenceDay
    } = initializeTimeStamp(date as Date)
    visualDate = differenceMonth > 1 || differenceDay > 7 ? 
    (messageDay.toString() + '/' + messageMonth.toString() + '/' + messageYear.toString()) : 
    defineWeekDay(differenceDay, messageHours)
  }
  
  return(
    <div className={styles.card}>
      <img src={avatarUrl} alt={`${name}`} className={styles.avatar} />
      <div className={styles.content}>
        <div className={styles.info}>
          <h3>{`${name}`}</h3>
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