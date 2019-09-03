import React, { SFC, PropsWithChildren } from 'react'
import HL from 'react-highlight/lib/optimized'
import { HighlightComponent } from '../../types'
import 'highlight.js/scss/vs.scss?raw'
import scss from './styles.scss'

const Highlight = HL as HighlightComponent

interface IProps  {
  code: string
  copyIcon: string
}

export const Example: SFC<PropsWithChildren<IProps>> = 
  ({ code, copyIcon, children}) => {
    function copyCode() {
      navigator.clipboard.writeText(code)
        .then(() => {
          console.log('Copied!')
        }, err => {
          console.error('Error when coping to clipboard.', err)
        })
    }

    return (
      <div className={scss.container}>
        <div className={`${scss.block} ${scss.example}`}>
          {children}
        </div>
        <div className={`${scss.block} ${scss.code}`}>
          <Highlight className={scss.hl} languages={['javascript']}>
            { code }
          </Highlight>
        </div>
        <button className={scss['copy']} onClick={copyCode}>
          <span className={`${scss['copy-icon']} mdi mdi-${copyIcon}`} />
        </button>
      </div>
    )
  }