import React, { SFC, useState, useRef } from 'react'
import { Example } from './example'
import { ExampleName, ExampleText } from '../../types'
import scss from './styles.scss'

type Props = {
  choosenExampleKey: string
  examples: [ExampleName, ExampleText][]
  chooseExample: (exampleKey: ExampleName) => void
}

type Time = {
  start: number
  end: number
}

type Pos = {
  start: number
  end: number
}

type State = {
  time: Time
  pos: Pos
}

export const Slider: SFC<Props> = ({ choosenExampleKey, examples, chooseExample }) => {
  const TIME_DIFF = 200
  const PASSIVE_SCALE = 0.9
  
  const [requestId, setRequestId] = useState<number | null>(null)
  const [state, setState] = useState<State | null>({
    time: { start: null, end: null },
    pos: { start: null, end: null }
  })

  const container = useRef<HTMLUListElement | null>(null)

  function getCurrentPos(startPos: number, endPos: number): number {
    const now = Date.now()
    const posDiff = endPos - startPos
    return now < state.time.end
      ? startPos + posDiff * (now - state.time.start) / TIME_DIFF
      : endPos
  }

  function updateState(scrollTop: number): void {
    const now = Date.now()
    setState(({ pos: { start, end }}) => ({
      time: {
        start: now,
        end: now + TIME_DIFF
      },
      pos: {
        start: getCurrentPos(start, end),
        end: scrollTop
      }
    }))
  }

  function scrollSlides(e: React.UIEvent<HTMLUListElement>): void {
    updateState(e.currentTarget.scrollTop)
    if (!requestId) {
      setRequestId(window.requestAnimationFrame(runAnimation))
    }
  }

  function runAnimation(): void {
    animate()

    if (Date.now() >= state.time.end + TIME_DIFF) {
      window.cancelAnimationFrame(requestId)
      setRequestId(null)
      return
    }
  
    setRequestId(window.requestAnimationFrame(runAnimation))
  }

  function getScaledElement(elements: Element[], containerTop: number): [Element, number] | null {
    const elIndex: number = elements.findIndex(el =>
      el.getBoundingClientRect().top - containerTop < 0 
      && el.getBoundingClientRect().top + el.clientHeight > containerTop
    )
    return elIndex !== -1 ? [elements[elIndex], elIndex] : null 
  }

  function getScale(
    elTop: number, elHeight: number, containerTop: number, currentDelta: number, isChoosen: boolean
  ): number {
    const elBottom = elTop + elHeight
    const coef = isChoosen ? 1 : PASSIVE_SCALE
    return ((elBottom - containerTop + currentDelta) / elHeight) * coef
  }

  function isChoosen(elIndex: number): boolean {
    return examples[elIndex][0] === choosenExampleKey
  }

  function updatedBottomElements(elements: Element[]): void {
    elements.forEach(el => el.removeAttribute('style'))
  }

  function animate(): void {
    const currentContainer = container.current
    if (!currentContainer) return
  
    const containerTop = currentContainer.getBoundingClientRect().top
    const containerChildren = Array.from(currentContainer.children)

    const currentPos = getCurrentPos(state.pos.start, state.pos.end)
    const currentDelta = state.pos.end - currentPos

    const se = getScaledElement(containerChildren, containerTop + currentDelta)

    if (!se) {
      if (containerChildren[0].getBoundingClientRect().top === containerTop) {
        updatedBottomElements(containerChildren)
      }
      return
    }
  
    const [scaledElement, scaledElementIndex] = se

    const scaleVal = getScale(
      scaledElement.getBoundingClientRect().top,
      scaledElement.clientHeight,
      containerTop,
      currentDelta,
      isChoosen(scaledElementIndex)
    )

    scaledElement.setAttribute('style', `transform: scale(${scaleVal > 0.01 ? scaleVal : 0.01})`)

    updatedBottomElements(containerChildren.slice(scaledElementIndex + 1))
  }

  return (
    <ul
      className={scss.examples}
      onScroll={scrollSlides}
      ref={container}
    >
      {examples.map(example => (
        <Example
          example={example}
          chooseExample={chooseExample}
          choosenExampleKey={choosenExampleKey}
          key={example[0]}
        />
      ))}
    </ul>
  )
}
