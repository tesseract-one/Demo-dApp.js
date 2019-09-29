import React, { SFC } from 'react'
import scss from './styles.scss'
import { INotificationPopup } from '../../types'

export const NotificationPopup: SFC<INotificationPopup> =
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