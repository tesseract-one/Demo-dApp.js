import { ReactNode, ElementType } from 'react'
import { Web3 } from '@tesseractjs/ethereum-web3'

export type Nullable<T> = { [P in keyof T]: T[P] | null }

export type KExample = 'showBalance' | 'sendEther' | 'showCuties' | 'getToken'

export interface IExample extends Object {
  component: JSX.Element
  code: string 
}

export type Examples = Record<KExample, IExample>

export interface IExampleText {
  title: string
  description: string
  tag: string
}

export type ExamplesText = Record<KExample, IExampleText>

export type KNetwork = 'main' | 'ropsten' | 'kovan' | 'rinkeby'

export interface INetwork {
  name: string
  endpoint: string
}

export type Networks = Record<KNetwork, INetwork>

export interface IWeb3WithAccounts {
  web3: Web3
  accounts: string[]
}

export type Web3s = Record<KNetwork, IWeb3WithAccounts | null>

export interface IWeb3Context {
  web3: Web3 | null
  web3s: Web3s
  accounts: string[]
  activeNetwork: KNetwork | null
  isMobile: boolean
  setPopup: (data: INotificationPopup) => void
}

export interface IHighlightProps {
  languages?: string[]
  children?: ReactNode  
  className?: string
  innerHTML?: boolean
}

export type HighlightComponent = ElementType<IHighlightProps>

export type KFreeToken = 'weenus' | 'xeenus' | 'yeenus' | 'zeenus'

export interface IFreeToken {
  title: string
  mobileTitle: string
  logo: string
  addresses: Record<KNetwork, string>
}

export type FreeTokens = Record<KFreeToken, IFreeToken>

export interface INotificationPopup {
  emoji: string
  title: string
  description: string
}