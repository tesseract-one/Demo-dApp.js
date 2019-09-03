import React, { forwardRef } from 'react'
import { KExample, IExampleText } from '../../../types'
import scss from './styles.scss'

interface IProps {
  example: [KExample, IExampleText]
  choosenExampleKey: string
  chooseExample: (exampleKry: string) => void
}

export const Example = forwardRef<HTMLLIElement, IProps>(
  ({ example, choosenExampleKey, chooseExample }, ref) => (
    <li
      className={`${scss.example} ${example[0] === choosenExampleKey ? scss.choosen : ''}`}
      onClick={() => chooseExample(example[0])}
      ref={ref}
    >
      <div className={scss['example-content']}>
        <span className={scss.tag}>
          {example[1].tag}
        </span>
        <span className={scss.title}>
          {example[1].title}
        </span>
        <p className={scss.description}>
          {example[1].description}
        </p>
      </div>
    </li>
  )
)