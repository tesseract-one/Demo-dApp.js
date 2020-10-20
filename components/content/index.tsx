import React, { FC, PropsWithChildren, useContext } from 'react'
import scss from './content.module.scss'
import { AppContext } from '../../types'
import Logo from '../../assets/images/logo.svg'

type Props = {
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

export const Content: FC<PropsWithChildren<Props>> = 
  ({ title, backToSite, children}) => {
    const { isTablet } = useContext(AppContext)

    return (
      <div className={scss.container}>
        <a className={scss['back-link']} href={backToSite.url}>
          {isTablet ? (
            <Logo
              className={scss['logo-image']}
              viewBox="0 0 40 40"
            />
          ) : (
            <>
              <span 
                className={`${scss['back-link-icon']} mdi mdi-${
                  !isTablet && backToSite.icon.desktop}`
                }
              />
              {backToSite.title}
            </>
          )}
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