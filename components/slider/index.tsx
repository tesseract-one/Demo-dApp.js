import * as React from 'react'
import { Example } from './example'
import {
  KExample,
  IExampleText,
  Nullable
} from '../../types'
import scss from './styles.scss'

interface IProps {
  choosenExampleKey: string
  examples: [KExample, IExampleText][]
  chooseExample: (exampleKey: string) => void
}

interface IState {
  startTime: number
  requestId: number
  scrollPos: {
    start: number
    end: number
  }
}

export class Slider extends React.Component<IProps, Nullable<IState>> {
  readonly state: Nullable<IState> = {
    startTime: null,
    requestId: null,
    scrollPos: {
      start: null,
      end: null
    }
  }

  private TIME_DIFF = 200
  private PASSIVE_SCALE = 0.9
  private container = React.createRef<HTMLUListElement>()

  endTime(): number | null {
    return this.state.startTime ? this.state.startTime + this.TIME_DIFF : null
  }

  newStartPos(now: number, startPos: number, endPos: number): number {
    return now < this.endTime() ? this.currentPos(startPos, endPos) : endPos
  }

  currentPos(startPos: number, endPos: number): number {
    const now = Date.now()
    const posDiff = endPos - startPos
    return now < this.endTime()
      ? startPos + posDiff * (now - this.state.startTime) / this.TIME_DIFF
      : endPos
  }

  updateAnimationData(scrollTop: number) {
    const now = Date.now()
    this.setState(prevState => ({
      startTime: now,
      scrollPos: {
        start: this.newStartPos(now, prevState.scrollPos.end, scrollTop),
        end: scrollTop
      }
    }))
  }

  scrollSlides(e: React.UIEvent<HTMLUListElement>) {
    this.updateAnimationData(e.currentTarget.scrollTop)
    if (!this.state.requestId) {
      this.setState({
        requestId: window.requestAnimationFrame(this.runAnimation.bind(this))
      })
    }
  }

  runAnimation() {
    this.animate()

    if (Date.now() >= this.endTime()) {
      window.cancelAnimationFrame(this.state.requestId)
      this.setState({ requestId: null })
      return
    }
  
    this.setState({
      requestId: window.requestAnimationFrame(this.runAnimation.bind(this))
    })
  }

  getRotatedElement(elements: Element[], containerTop: number): [Element, number] | null {
    const elIndex: number = elements.findIndex(el =>
      el.getBoundingClientRect().top - containerTop < 0 
      && el.getBoundingClientRect().top + el.clientHeight > containerTop
    )
    return elIndex !== -1 ? [elements[elIndex], elIndex] : null 
  }

  updatedBottomElements(elements: Element[]) {
    elements.forEach(el => el.removeAttribute('style'))
  }

  getScale(elTop: number, elHeight: number, containerTop: number, currentDelta: number, isChoosen: boolean): number {
    const elBottom = elTop + elHeight
    const coef = isChoosen ? 1 : this.PASSIVE_SCALE
    return ((elBottom - containerTop + currentDelta) / elHeight) * coef
  }

  isChoosen(elIndex): boolean {
    return this.props.examples[elIndex][0] === this.props.choosenExampleKey
  }

  animate() {
    const container = this.container.current
    if (!container) return
  
    const containerTop = container.getBoundingClientRect().top
    const containerChildren = Array.from(container.children)

    const currentPos = this.currentPos(this.state.scrollPos.start, this.state.scrollPos.start)
    const currentDelta = this.state.scrollPos.end - currentPos

    const re = this.getRotatedElement(containerChildren, containerTop + currentDelta)
    if (!re) return
    const [rotatedElement, rotatedElementIndex] = re

    const scaleVal = this.getScale(
      rotatedElement.getBoundingClientRect().top,
      rotatedElement.clientHeight,
      containerTop,
      currentDelta,
      this.isChoosen(rotatedElementIndex)
    )
    rotatedElement.setAttribute('style', `transform: scale(${scaleVal > 0.01 ? scaleVal : 0.01})`)

    this.updatedBottomElements(containerChildren.slice(rotatedElementIndex + 1))
  }

  render() {
    const { examples, chooseExample, choosenExampleKey } = this.props

    return (
      <ul
        className={scss.examples}
        onScroll={e => this.scrollSlides(e)}
        ref={this.container}
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
}