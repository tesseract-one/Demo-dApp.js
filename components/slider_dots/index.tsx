import * as React from 'react'
import { IExample } from '../../types'
import scss from './styles.scss'

interface Props {
  choosenExampleKey: string
  examplesKeys: string[]
  chooseExample: (exampleKey: string) => void
}

export const SliderDots = (props: Props) => (
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