import React, { SFC, PropsWithChildren } from 'react'
import scss from './styles.scss'

interface IProps {
  title: string
  backToSite: {
    title: string
    icon: string
    url: string
  }
}

export const Content: SFC<PropsWithChildren<IProps>> = 
  ({ title, backToSite, children}) => (
    <div className={scss.container}>
      <a className={scss['back-link']} href={backToSite.url}>
        <span className={`${scss['back-link-icon']} mdi mdi-${backToSite.icon}`} />
        {backToSite.title}
      </a>
      <h1 className={scss.title}>
        {title}
      </h1>
      <div className={scss.example}>
        {children}
      </div>
    </div>
  )