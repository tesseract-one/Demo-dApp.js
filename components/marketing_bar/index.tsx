import React, { SFC } from 'react'
import Logo from "../../assets/images/logo.svg"
import scss from './styles.scss'

interface IProps {
  tesseractLink: string
  socials: {
    url: string
    icon: string
  }[]
  copyright: {
    icon: string
    text: {
      head: string
      tail: string
    }
    link: {
      title: string
      url: string
    }
  }
}

export const MarketingBar: SFC<IProps> = 
  ({ tesseractLink, socials, copyright }) => (
    <div className={scss.container}>
      <a className={scss.logo} href={tesseractLink}>
        <Logo className={scss['logo-image']} /> 
      </a>
      <ul className={scss.socials}>
        {
          socials.map(social => (
            <li className={scss.social} key={social.url}>
              <a className={scss['social-link']} href={social.url} target="_blank" rel="noopener noreferrer">
                <span className={`mdi mdi-${social.icon}`} />
              </a>
            </li>
          ))
        }
      </ul>
      <div className={scss.copyright}>
        <span className={`mdi mdi-${copyright.icon}`} />
        <div className={scss['copyright-tooltip']}>
          {copyright.text.head}
          <a className={scss.company} href={copyright.link.url} target="_blank" rel="noopener noreferrer">
            {copyright.link.title}
          </a>
          <br/>
          {copyright.text.tail}
        </div>
      </div>
    </div>
  )