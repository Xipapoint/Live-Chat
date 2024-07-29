import React from 'react'
import ChatPersonInfo from './chatWindowNav/ChatNav.tsx'
import styles from './chatWindow.module.scss'
const ChatWindow = () => {
  return (
    <div className={styles.chat}>
      <ChatPersonInfo/>
      <div className={styles.canvas}>
        lala
      </div>
    </div>
  )
}

export default ChatWindow
