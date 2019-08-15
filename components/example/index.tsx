import * as React from 'react'
import HL from 'react-highlight/lib/optimized'
import { HighlightComponent } from '../../types'
import 'highlight.js/scss/vs.scss?raw'
import scss from './styles.scss'

const Highlight = HL as HighlightComponent

interface IProps  {
  code: string
  copyIcon: string
}

export const Example = (props: React.PropsWithChildren<IProps>) => {
  function copyCode() {
    navigator.clipboard.writeText(props.code)
      .then(() => {
        console.log('Copied!')
      }, err => {
        console.error('Error when coping to clipboard.', err)
      })
  }

  return (
    <div className={scss.container}>
      <div className={`${scss.block} ${scss.example}`}>
        {props.children}
      </div>
      <div className={`${scss.block} ${scss.code}`}>
        <Highlight className={scss.hl} languages={['javascript']}>
          { props.code }
        </Highlight>
      </div>
      <button className={scss['copy']} onClick={copyCode}>
        <span className={`${scss['copy-icon']} mdi mdi-${props.copyIcon}`} />
      </button>
    </div>
  )
}