import React, { FC } from 'react'
import scss from './slider_dots.module.scss'
import { ExampleName } from '../../types'

interface IProps {
  choosenExampleKey: string
  examplesKeys: ExampleName[]
  chooseExample: (exampleKey: ExampleName) => void
}

export const SliderDots: FC<IProps> =
  ({ choosenExampleKey, chooseExample, examplesKeys }) => {
    function changeExample(exampleKey: ExampleName): void {
      chooseExample(exampleKey)
    }

    return (
      <ul className={scss['slider-dots']}>
        {
          examplesKeys.map(exampleKey => (
            <li
              className={`${scss.dot} ${exampleKey === choosenExampleKey ? scss.choosen : ''}`}
              onClick={changeExample.bind(null, exampleKey)}
              key={exampleKey}
            />
          ))
        }
      </ul>
    )
  }