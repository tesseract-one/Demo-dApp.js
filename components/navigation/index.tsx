import * as React from 'react'
import scss from './styles.scss'

interface Props {
  title: string
  slider?: React.ReactNode
  sliderDots?: React.ReactNode
  networks?: React.ReactNode
}

export const Navigation = (props: Props) => (
  <div className={scss.container}>
    <div className={scss.networks}>
      {props.networks}
    </div>
    <span className={scss.title}>
      {props.title}
    </span>
    <div className={scss.slider}>
      {props.slider}
    </div>
    {props.sliderDots}
  </div>
)