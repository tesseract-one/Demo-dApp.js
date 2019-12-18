import React, { ReactNode, ElementType } from 'react'
import { Web3 } from '@tesseractjs/ethereum-web3'

export type ExampleName = 'showBalance' | 'sendEther' | 'showCuties' | 'getToken'

export type ExampleInfo = {
  component: JSX.Element
  code: string 
}

export type Examples = Record<ExampleName, ExampleInfo>

export type ExampleText = {
  title: string
  description: string
  tag: string
}

export type ExamplesText = Record<ExampleName, ExampleText>

export type NetworkType = 'main' | 'ropsten' | 'kovan' | 'rinkeby'

export type NetworkInfo = {
  name: string
  endpoint: string
}

export type Account = { pubKey: string; balance?: number }

export type NetworksInfo = Record<NetworkType, NetworkInfo>

export type Connections = Partial<Record<NetworkType, Web3>>

export type AppContextType = {
  connections: Connections
  accounts: Account[]
  accountIndex?: number
  activeNetwork?: NetworkType
  ethUsdRate?: number
  isTablet: boolean
  setBalance: (accountIndex: number, balance: number) => void
  setEthUsdRate: (rate: number) => void
  isCodeOpened: boolean
  setIsCodeOpened: (isCodeOpened: boolean) => void
}

export type HighlightProps = {
  languages?: string[]
  children?: ReactNode  
  className?: string
  innerHTML?: boolean
}

export type HighlightComponent = ElementType<HighlightProps>

export type FreeTokenType = 'weenus' | 'xeenus' | 'yeenus' | 'zeenus'

export type FreeTokenInfo = {
  title: string
  logo: string
  addresses: Record<NetworkType, string>
}

export type FreeTokens = Record<FreeTokenType, FreeTokenInfo>

export { Web3 }

export const AppContext = React.createContext<AppContextType>({
  connections: {},
  accounts: [],
  isTablet: false,
  setBalance: () => {return},
  setEthUsdRate: () => {return},
  isCodeOpened: false,
  setIsCodeOpened: () => {return}
})