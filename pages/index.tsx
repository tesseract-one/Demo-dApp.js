import * as React from 'react'
import { Tesseract, Network, Web3 } from '@tesseractjs/ethereum-web3'
import * as C from '../components'

import texts from '../assets/texts.json'
import showBalanceTxt from '../assets/code/show_balance.txt'
import sendEtherTxt from '../assets/code/send_ethereum.txt'
import showKittiesTxt from '../assets/code/show_kitties.txt'
import getTokenTxt from '../assets/code/get_free_token.txt'

import 'roboto-fontface/css/roboto/sass/roboto-fontface.scss?raw'
import '@mdi/font/scss/materialdesignicons.scss?raw'
import '../assets/styles/global.scss?raw'
import scss from './styles.scss'

// Tesseract.Ethereum.Web3.rpcUrls = {
//   [Network.Main]: texts.rpcUrls.main,
//   [Network.Ropsten]: texts.rpcUrls.ropsten,
//   [Network.Rinkeby]: texts.rpcUrls.rinkeby,
//   [Network.Kovan]: texts.rpcUrls.kovan
// }


interface Example {
  [key: string]: { component: JSX.Element, code: string }
}

const example: Example = {
  showBalance: {
    component: <C.ShowBalance {...texts.example.examples.showBalance.content} />,
    code: showBalanceTxt
  },
  sendEther: {
    component: <C.SendEther {...texts.example.examples.sendEther.content} />,
    code: sendEtherTxt
  },
  showKitties: {
    component: <C.ShowKitties />,
    code: showKittiesTxt
  },
  getToken: {
    component: <C.GetFreeToken {...texts.example.examples.getToken.content} />,
    code: getTokenTxt
  }
}

export type Web3Context = {
  web3: Web3 | null,
  accounts: string[]
}
type State = Web3Context & {
  choosenExampleKey: string
}

export const { 
  Provider: Web3CtxProvider,
  Consumer: Web3CtxConsumer 
} = React.createContext<Web3Context | null>(null)

class Index extends React.Component<never, State> {
  readonly state = {
    web3: null,
    accounts: [],
    choosenExampleKey: "showBalance"
  }

  chooseExample(choosenExampleKey: string) {
    this.setState({ choosenExampleKey })
  }

  async changeNetwork(networkEndpoint: string) {
    const web3 = await Tesseract.Ethereum.Web3(networkEndpoint)
    // web3.hasClientWallet
    const accounts: string[] = await web3.eth.getAccounts()
    this.setState({ web3, accounts })
  }

  async componentDidMount() {
    await this.changeNetwork(texts.networks.main.endpoint)
  }

  render() {
    if (!this.state.web3) return (
      <h1>Waiting for web3 initialization ...</h1>
    )

    return (
      <Web3CtxProvider value={this.state}>
        <div className={scss.container}>
          <div className={scss['left-side']}>
            <C.MarketingBar />
          </div>
          <div className={scss.center}>
            <C.Content>
              <C.Example
                code={example[this.state.choosenExampleKey].code}
                copyIcon={texts.example.copyIcon}
              >
                {example[this.state.choosenExampleKey].component}
              </C.Example>
            </C.Content>
          </div>
          <div className={scss['right-side']}>
            <C.Navigation
              title={texts.example.title}
              slider={
                <C.Slider
                  choosenExampleKey={this.state.choosenExampleKey}
                  examplesEntries={Object.entries(texts.example.examples)}
                  chooseExample={this.chooseExample.bind(this)}
                />
              }
              sliderDots={
                <C.SliderDots
                  choosenExampleKey={this.state.choosenExampleKey}
                  examplesKeys={Object.keys(texts.example.examples)}
                  chooseExample={this.chooseExample.bind(this)}
                />
              }
              networks={
                <C.Networks
                  networks={Object.values(texts.networks)}
                  changeNetwork={this.changeNetwork.bind(this)}
                />
              }
            />
          </div>
        </div>
      </Web3CtxProvider>
    )
  }
}

export default Index