import React, { ForwardRefRenderFunction, forwardRef } from 'react'
import { ExampleName, ExampleText } from '../../../types'
import scss from './example.module.scss'

interface IProps {
  example: [ExampleName, ExampleText]
  choosenExampleKey: string
  chooseExample: (exampleKry: string) => void
}


const Component: ForwardRefRenderFunction<HTMLLIElement, IProps> = 
  ({ example, choosenExampleKey, chooseExample }, ref) => {
    function changeExample(): void {
      chooseExample(example[0])
    }

    return (
      <li
        className={`${scss.example} ${example[0] === choosenExampleKey ? scss.choosen : ''}`}
        onClick={changeExample}
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
  }

export const Example = forwardRef<HTMLLIElement, IProps>(Component)