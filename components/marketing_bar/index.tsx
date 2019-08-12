import * as React from 'react'
import Logo from "../../assets/images/logo.svg"
import SVG from 'react-inlinesvg'
import texts from '../../assets/texts.json'
import scss from './styles.scss'

export const MarketingBar = (_props: {}) => (
  <div className={scss.container}>
    <a className={scss.logo} href={texts.links.tesseract}>
      <SVG className={scss['logo-image']} src={Logo} /> 
    </a>
    <ul className={scss.socials}>
      {
        texts.links.socials.map(social => (
          <li className={scss.social} key={social.url}>
            <a className={scss['social-link']} href={social.url} target="_blank">
              <span className={`mdi mdi-${social.icon}`} />
            </a>
          </li>
        ))
      }
    </ul>
    <div className={scss.copyright}>
      <span className={`mdi mdi-${texts.copyright.icon}`} />
      <div
        className={scss['copyright-tooltip']}
        dangerouslySetInnerHTML={{ __html: texts.copyright.text }}
      />
    </div>
  </div>
)