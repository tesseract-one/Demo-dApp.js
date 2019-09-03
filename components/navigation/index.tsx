import React, { SFC } from 'react'
import scss from './styles.scss'

interface IProps {
  title: string
  slider: React.ReactNode
  sliderDots: React.ReactNode
  networks: React.ReactNode
}

export const Navigation: SFC<IProps> =
  ({ title, slider, sliderDots, networks }) => (
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