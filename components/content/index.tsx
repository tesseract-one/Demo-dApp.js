import * as React from 'react'
import scss from './styles.scss'

interface IProps {
  title: string
  backToSite: {
    title: string
    icon: string
    url: string
  }
}

export const Content = (props: React.PropsWithChildren<IProps>) => (
  <div className={scss.container}>
    <a className={scss['back-link']} href={props.backToSite.url}>
      <span className={`${scss['back-link-icon']} mdi mdi-${props.backToSite.icon}`} />
      {props.backToSite.title}
    </a>
    <h1 className={scss.title}>
      {props.title}
    </h1>
    <div className={scss.example}>
      {props.children}
    </div>
  </div>
)