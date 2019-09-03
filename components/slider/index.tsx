import React, { SFC, useState, useRef } from 'react'
import { Example } from './example'
import { KExample, IExampleText, Nullable } from '../../types'
import scss from './styles.scss'

interface IProps {
  choosenExampleKey: string
  examples: [KExample, IExampleText][]
  chooseExample: (exampleKey: KExample) => void
}

interface IScrollPos {
  start: number
  end: number
}

export const Slider: SFC<IProps> =
  ({ choosenExampleKey, examples, chooseExample }) => {
    const [startTime, setStartTime] = useState<number | null>(null)
    const [requestId, setRequestId] = useState<number | null>(null)
    const [scrollPos, setScrollPos] = useState<Nullable<IScrollPos>>({
      start: null,
      end: null
    })

    const container = useRef<HTMLUListElement | null>(null)

    const TIME_DIFF = 200
    const PASSIVE_SCALE = 0.9

    function endTime(): number | null {
      return startTime ? startTime + TIME_DIFF : null
    }

    function getCurrentPos(startPos: number, endPos: number): number {
      const now = Date.now()
      const posDiff = endPos - startPos
      return now < endTime()
        ? startPos + posDiff * (now - startTime) / TIME_DIFF
        : endPos
    }

    function newStartPos(now: number, startPos: number, endPos: number): number {
      return now < endTime() ? getCurrentPos(startPos, endPos) : endPos
    }

    function updateAnimationData(scrollTop: number) {
      const now = Date.now()
      setStartTime(now)
      setScrollPos(({ end }) => ({
        start: newStartPos(now, end, scrollTop),
        end: scrollTop
      }))
    }

    function scrollSlides(e: React.UIEvent<HTMLUListElement>) {
      updateAnimationData(e.currentTarget.scrollTop)
      if (!requestId) {
        setRequestId(window.requestAnimationFrame(runAnimation))
      }
    }

    function runAnimation() {
      animate()

      if (Date.now() >= endTime()) {
        window.cancelAnimationFrame(requestId)
        setRequestId(null)
        return
      }
    
      setRequestId(window.requestAnimationFrame(runAnimation))
    }

    function getRotatedElement(elements: Element[], containerTop: number): [Element, number] | null {
      const elIndex: number = elements.findIndex(el =>
        el.getBoundingClientRect().top - containerTop < 0 
        && el.getBoundingClientRect().top + el.clientHeight > containerTop
      )
      return elIndex !== -1 ? [elements[elIndex], elIndex] : null 
    }

    function updatedBottomElements(elements: Element[]) {
      elements.forEach(el => el.removeAttribute('style'))
    }

    function getScale(elTop: number, elHeight: number, containerTop: number, currentDelta: number, isChoosen: boolean): number {
      const elBottom = elTop + elHeight
      const coef = isChoosen ? 1 : PASSIVE_SCALE
      return ((elBottom - containerTop + currentDelta) / elHeight) * coef
    }

    function isChoosen(elIndex): boolean {
      return examples[elIndex][0] === choosenExampleKey
    }

    function animate() {
      const currentContainer = container.current
      if (!currentContainer) return
    
      const containerTop = currentContainer.getBoundingClientRect().top
      const containerChildren = Array.from(currentContainer.children)

      const currentPos = getCurrentPos(scrollPos.start, scrollPos.start)
      const currentDelta = scrollPos.end - currentPos

      const re = getRotatedElement(containerChildren, containerTop + currentDelta)
      if (!re) return
      const [rotatedElement, rotatedElementIndex] = re

      const scaleVal = getScale(
        rotatedElement.getBoundingClientRect().top,
        rotatedElement.clientHeight,
        containerTop,
        currentDelta,
        isChoosen(rotatedElementIndex)
      )
      rotatedElement.setAttribute('style', `transform: scale(${scaleVal > 0.01 ? scaleVal : 0.01})`)

      updatedBottomElements(containerChildren.slice(rotatedElementIndex + 1))
    }

    return (
      <ul
        className={scss.examples}
        onScroll={e => scrollSlides(e)}
        ref={container}
      >
        {
          examples.map(example => (
            <Example
              example={example}
              chooseExample={chooseExample}
              choosenExampleKey={choosenExampleKey}
              key={example[0]}
            />
          ))
        }
      </ul>
    )
  }