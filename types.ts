import * as React from 'react'
import { Web3 } from '@tesseractjs/ethereum-web3'

export type Nullable<T> = { [P in keyof T]: T[P] | null }

export type KExample = 'showBalance' | 'sendEther' | 'showKitties' | 'getToken'

export interface IExample {
  component: JSX.Element
  code: string 
}

export interface IExamples extends Record<KExample, IExample>{}

export interface IExampleText {
  title: string
  description: string
  tag: string
}

export interface IExamplesText extends Record<KExample, IExampleText>{}

export type KNetwork = 'main' | 'ropsten' | 'kovan' | 'rinkeby'

export interface INetwork {
  name: string
  endpoint: string
}

export interface INetworks extends Record<KNetwork, INetwork>{}

export interface IWeb3WithAccounts {
  web3: Web3
  accounts: string[]
}

export interface IWeb3s extends Record<KNetwork, IWeb3WithAccounts | null>{}

export interface IWeb3Context {
  web3: Web3 | null
  web3s: IWeb3s
  accounts: string[]
  activeNetwork: KNetwork
}

export interface IHighlightProps {
  languages?: string[]
  children?: React.ReactNode  
  className?: string
  innerHTML?: boolean
}

export type HighlightComponent = React.ElementType<IHighlightProps>

export type KFreeToken = 'weenus' | 'xeenus' | 'yeenus' | 'zeenus'

export interface IFreeToken {
  title: string
  logo: string
  addresses: Record<KNetwork, string>
}

export interface IFreeTokens extends Record<KFreeToken, IFreeToken>{}