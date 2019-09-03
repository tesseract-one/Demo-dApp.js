import React, { SFC } from 'react'
import scss from './styles.scss'
import { KExample } from '../../types'

interface IProps {
  choosenExampleKey: string
  examplesKeys: KExample[]
  chooseExample: (exampleKey: KExample) => void
}

export const SliderDots: SFC<IProps> =
  ({ choosenExampleKey, chooseExample, examplesKeys }) => (
    <ul className={scss['slider-dots']}>
      {
        examplesKeys.map(exampleKey => (
          <li
            className={`${scss.dot} ${exampleKey === choosenExampleKey ? scss.choosen : ''}`}
            onClick={() => chooseExample(exampleKey)}
            key={exampleKey}
          />
        ))
      }
    </ul>
  )