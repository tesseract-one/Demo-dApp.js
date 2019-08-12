import * as React from 'react'
import texts from '../../assets/texts.json'
import scss from './styles.scss'

export const Content = (props: React.PropsWithChildren<{}>) => (
  <div className={scss.container}>
    <a className={scss['back-link']} href={texts.links.backToSite.url}>
      <span className={`${scss['back-link-icon']} mdi mdi-${texts.links.backToSite.icon}`} />
      {texts.links.backToSite.title}
    </a>
    <h1 className={scss.title}>
      {texts.title}
    </h1>
    <div className={scss.example}>
      {props.children}
    </div>
  </div>
)