import React, { SFC, PropsWithChildren, useContext } from 'react'
import scss from './styles.scss'
import { Web3Context } from '../../pages'

interface IProps {
  title: string
  backToSite: {
    title: string
    icon: {
      desktop: string
      mobile: string
    }
    url: string
  }
}

export const Content: SFC<PropsWithChildren<IProps>> = 
  ({ title, backToSite, children}) => {
    const { isTablet } = useContext(Web3Context)

    return (
      <div className={scss.container}>
        <a className={scss['back-link']} href={backToSite.url}>
          <span 
            className={`${scss['back-link-icon']} mdi mdi-${
              !isTablet ? backToSite.icon.desktop : backToSite.icon.mobile}`
            }
          />
          {!isTablet && backToSite.title}
        </a>
        {!isTablet && 
          <h1 className={scss.title}>
            {title}
          </h1>
        }
        <div className={scss.example}>
          {children}
        </div>
      </div>
    )
  }