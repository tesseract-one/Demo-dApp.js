import React, { FC, useContext } from 'react'
import scss from './navigation.module.scss'
import { AppContext } from '../../types'

interface IProps {
  title: string
  slider: React.ReactNode
  sliderDots: React.ReactNode
  networks: React.ReactNode
}

export const Navigation: FC<IProps> =
  ({ title, slider, sliderDots, networks }) => {
    const { isTablet } = useContext(AppContext)

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