import React, { SFC, useState, ReactElement } from 'react'
import scss from './styles.scss'

const NotificationPopup: SFC<NotificationPopupData> =
  ({ emoji, title, description }) => (
    <div className={scss.wrapper}>
      <div className={scss.container}>
        <div className={scss.content}>
          <span className={scss.emoji}>{ emoji }</span>
          <span className={scss.title}>{ title }</span>
          <p className={scss.description}>{ description }</p>
        </div>
      </div>
    </div>
  )

export type NotificationPopupData = {
  emoji: string
  title: string
  description: string
}

export type NotificationContextType = {
  showPopup?: (data: NotificationPopupData) => void
}

export const NotificationContext = React.createContext<NotificationContextType>({})

export const NotificationPopupService: SFC = ({children}) => {
  const [popup, setPopup] = useState<ReactElement<NotificationPopupData> | undefined>()

  function showPopup(data: NotificationPopupData) {
    setPopup(<NotificationPopup { ...data } />)
    setTimeout(() => {
      setPopup(undefined)
    }, 3000)
  }

  return (
    <NotificationContext.Provider value={{showPopup}}>
      {children}
      {popup}
    </NotificationContext.Provider>
  )
}