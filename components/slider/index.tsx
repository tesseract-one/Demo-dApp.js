import * as React from 'react'
import {
  KExample,
  IExampleText
} from '../../types'
import scss from './styles.scss'

interface IProps {
  choosenExampleKey: string
  examples: [KExample, IExampleText][]
  chooseExample: (exampleKry: string) => void
}

export const Slider = (props: IProps) => (
  <ul className={scss.examples}>
    {
      props.examples.map(exampleEntry => (
        <li
          className={`${scss.example} ${exampleEntry[0] === props.choosenExampleKey ? scss.choosen : ''}`}
          onClick={() => props.chooseExample(exampleEntry[0])}
          key={exampleEntry[0]}
        >
          <div className={scss['example-content']}>
            <span className={scss.tag}>
              {exampleEntry[1].tag}
            </span>
            <span className={scss.title}>
              {exampleEntry[1].title}
            </span>
            <p className={scss.description}>
              {exampleEntry[1].description}
            </p>
          </div>
        </li>
      ))
    }
  </ul>
)