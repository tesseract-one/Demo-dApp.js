import * as React from 'react'
import scss from './styles.scss'
import { KExample } from '../../types'

interface IProps {
  choosenExampleKey: string
  examplesKeys: KExample[]
  chooseExample: (exampleKey: string) => void
}

export const SliderDots = (props: IProps) => (
  <ul className={scss['slider-dots']}>
    {
      props.examplesKeys.map(exampleKey => (
        <li
          className={`${scss.dot} ${exampleKey === props.choosenExampleKey ? scss.choosen : ''}`}
          onClick={() => props.chooseExample(exampleKey)}
          key={exampleKey}
        />
      ))
    }
  </ul>
)