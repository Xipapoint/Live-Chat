import React from 'react'
import ChatList from '../components/chat/chatList/List'
import styles from './chatWindows.module.scss'
import ChatFind from '../components/chat/chatFind/ChatFind'
import ChatWindow from '../components/chat/chatWindow/ChatWindow'
const chatWindow = () => {
  return (
    <div style={{display: 'flex'}}>
      <div className={styles.chatLeftNavbar}>
        <ChatFind/>
        <ChatList/>
      </div>
      <div className={styles.chatBlock}>
        <ChatWindow/>
      </div>
    </div>

  )
}

export default chatWindow
