import React, { SFC, useContext } from 'react'
import scss from './styles.scss'
import { Web3Context } from '../../pages'

interface IProps {
  title: string
  slider: React.ReactNode
  sliderDots: React.ReactNode
  networks: React.ReactNode
}

export const Navigation: SFC<IProps> =
  ({ title, slider, sliderDots, networks }) => {
    const { isTablet } = useContext(Web3Context)

    if (!isTablet) {
      return (
        <div className={scss.container}>
          <div className={scss.networks}>
            {networks}
          </div>
          <span className={scss.title}>
            {title}
          </span>
          <div className={scss.slider}>
            {slider}
          </div>
          {sliderDots}
        </div>
      )
    }

    return (
      <>
        <div className={scss['slider-dots']}>
          {sliderDots}
        </div>
        <div className={scss.networks}>
          {networks}
        </div>
      </>
    )
  }