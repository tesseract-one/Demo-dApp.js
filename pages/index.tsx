import * as React from 'react'
import { Tesseract } from '@tesseractjs/ethereum-web3'
import * as T from '../types'
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

const examples: T.IExamples = {
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

interface IState extends T.IWeb3Context {
  choosenExampleKey: T.KExample
}

export const { 
  Provider: Web3CtxProvider,
  Consumer: Web3CtxConsumer 
} = React.createContext<T.IWeb3Context | null>(null)

class Index extends React.Component<never, IState> {
  readonly state = {
    web3: null,
    accounts: [],
    web3s: null,
    activeNetwork: null,
    choosenExampleKey: 'showBalance' as T.KExample
  }

  chooseExample(choosenExampleKey: T.KExample) {
    this.setState({ choosenExampleKey })
  }

  changeNetwork(network: T.KNetwork) {
    this.setState(state => ({
      web3: state.web3s[network].web3,
      accounts: state.web3s[network].accounts,
      activeNetwork: network
    }))
  }

  chooseDefaultNetwork() {
    const network = Object.entries<T.IWeb3s, T.KNetwork>(this.state.web3s)
      .find(([_, web3]) => web3 !== null)

    if (!network) throw Error('No web3 at all')
  
    this.setState({
      web3: network[1].web3,
      accounts: network[1].accounts,
      activeNetwork: network[0]
    })
  }

  async loadNetworks() {
    const web3sArray = await Promise.all(
      Object.entries<T.INetworks, T.KNetwork>(texts.networks)
        .map(async (network): Promise<Partial<T.IWeb3s>> => 
          {
            try {
              const web3 = await Tesseract.Ethereum.Web3(network[1].endpoint)
              if (!web3.hasClientWallet) return { [network[0]]: null }
              const accounts: string[] = await web3.eth.getAccounts()
              return { [network[0]]: { web3, accounts } }
            } catch (error) {
              console.error(error)
              return { [network[0]]: null }
            }
          }
        )
    )
    const web3s = web3sArray
      .reduce<Partial<T.IWeb3s>>((acc, web3) => ({ ...acc, ...web3 }), {}) as T.IWeb3s

    this.setState({ web3s }, this.chooseDefaultNetwork)
  }

  async componentDidMount() {
    await this.loadNetworks()
  }

  render() {
    if (!this.state || !this.state.web3) return (
      <h1>Waiting for web3 initialization ...</h1>
    )

    return (
      <Web3CtxProvider value={this.state}>
        <div className={scss.container}>
          <div className={scss['left-side']}>
            <C.MarketingBar
              tesseractLink={texts.links.tesseract}
              socials={texts.links.socials}
              copyright={texts.copyright}
            />
          </div>
          <div className={scss.center}>
            <C.Content
              title={texts.title}
              backToSite={texts.links.backToSite}
            >
              <C.Example
                code={examples[this.state.choosenExampleKey].code}
                copyIcon={texts.example.copyIcon}
              >
                {examples[this.state.choosenExampleKey].component}
              </C.Example>
            </C.Content>
          </div>
          <div className={scss['right-side']}>
            <C.Navigation
              title={texts.example.title}
              slider={
                <C.Slider
                  choosenExampleKey={this.state.choosenExampleKey}
                  examples={Object.entries<T.IExamplesText, T.KExample>(texts.example.examples)}
                  chooseExample={this.chooseExample.bind(this)}
                />
              }
              sliderDots={
                <C.SliderDots
                  choosenExampleKey={this.state.choosenExampleKey}
                  examplesKeys={Object.keys<T.IExamplesText, T.KExample>(texts.example.examples)}
                  chooseExample={this.chooseExample.bind(this)}
                />
              }
              networks={
                <C.Networks
                  web3s={this.state.web3s}
                  networks={texts.networks}
                  activeNetwork={this.state.activeNetwork}
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