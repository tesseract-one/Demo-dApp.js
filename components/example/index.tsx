import React, { SFC, PropsWithChildren, useContext } from 'react'
import { Swipeable } from 'react-swipeable'
import HL from 'react-highlight/lib/optimized'
import { HighlightComponent, ExampleName } from '../../types'
import 'highlight.js/scss/vs.scss?raw'
import scss from './styles.scss'
import { AppContext } from '../../types'

const Highlight = HL as HighlightComponent

interface ITexts {
  title: string
  description: string
  category: string
  signature: string
}

interface IProps {
  code: string
  copyIcon: string
  codeLabel: string
  goGithub: {
    url: string
    text: string
  }
  choosenExampleKey: ExampleName
  examplesKeys: ExampleName[]
  chooseExample: (exampleKey: ExampleName) => void
  texts?: ITexts
}

export const Example: SFC<PropsWithChildren<IProps>> = 
  ({ code, copyIcon, codeLabel, goGithub, choosenExampleKey, examplesKeys, chooseExample, children, texts }) => {
    const { isTablet, isCodeOpened, setIsCodeOpened } = useContext(AppContext)

    function copyCode(): void {
      navigator.clipboard.writeText(code)
        .then(() => {
          console.log('Copied!')
        }, err => {
          console.error('Error when coping to clipboard.', err)
        })
    }

    function showCode(): void {
      setIsCodeOpened(true)
    }

    function hideCode(): void {
      setIsCodeOpened(false)
    }

    function nextExample(): void {
      const exampleKeyPos = examplesKeys.indexOf(choosenExampleKey)
      exampleKeyPos + 1 === examplesKeys.length
      ? chooseExample(examplesKeys[0])
      : chooseExample(examplesKeys[exampleKeyPos + 1])
    }

    function prevExample(): void {
      const exampleKeyPos = examplesKeys.indexOf(choosenExampleKey)
      exampleKeyPos === 0
      ? chooseExample(examplesKeys[examplesKeys.length - 1])
      : chooseExample(examplesKeys[exampleKeyPos - 1])
    }

    if (!isTablet) {
      return (
        <div className={scss.container}>
          <div className={`${scss.block} ${scss.example}`}>
            { children }
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

    return (
      <div className={scss.container}>
        <Swipeable
          className={`${scss.example} ${isCodeOpened ? scss['code-opened'] : ''}`}
          onSwipedLeft={nextExample}
          onSwipedRight={prevExample}
        >
          <span className={scss.title}>{texts.title}</span>
          <p className={scss.description}>{texts.description}</p>
          <div className={scss['children-container']}>
            {children}
          </div>
        </Swipeable>
        <div
          className={`${scss['code-container']} ${isCodeOpened ? scss.opened : ''}`}
          onClick={showCode}
        >
          <Swipeable
            className={scss.swipeable}
            onSwipedUp={showCode}
            onSwipedDown={hideCode}
          >
            <span className={scss.label}>{codeLabel}</span>
            <div className={scss['bottom-line']} />
          </Swipeable>
          <div className={scss.code}>
            <span className={scss.category}>{texts.category}</span>
            <span className={scss.title}>{`${texts.title} Example`}</span>
            <span className={scss.signature}>{texts.signature}</span>
            <Highlight className={scss.hl} languages={['javascript']}>
              { code }
            </Highlight>
            <div className={scss['bottom-line']} />
            <a href={goGithub.url} className={scss['go-github']}>
              {goGithub.text}
            </a>
          </div>
        </div>
      </div>
    )
  }
