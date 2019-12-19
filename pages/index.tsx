import React, { SFC, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { Tesseract } from '@tesseractjs/ethereum-web3'
import Head from 'next/head'
import * as T from '../types'
import * as C from '../components'
import texts from '../assets/texts.json'
import showBalanceTxt from '../assets/code/show_balance.txt'
import sendEtherTxt from '../assets/code/send_ethereum.txt'
import showCutiesTxt from '../assets/code/show_cuties.txt'
import getTokenTxt from '../assets/code/get_free_token.txt'
import 'roboto-fontface/css/roboto/sass/roboto-fontface.scss?raw'
import '@mdi/font/scss/materialdesignicons.scss?raw'
import '../assets/styles/global.scss?raw'
import scss from './styles.scss'

const examples: T.Examples = {
  showBalance: {
    component: <C.ShowBalance {...texts.example.examples.showBalance.content} />,
    code: showBalanceTxt
  },
  sendEther: {
    component: <C.SendEther {...texts.example.examples.sendEther.content} />,
    code: sendEtherTxt
  },
  showCuties: {
    component: <C.ShowCuties { ...texts.example.examples.showCuties.content} />,
    code: showCutiesTxt
  },
  getToken: {
    component: <C.GetFreeToken {...texts.example.examples.getToken.content} />,
    code: getTokenTxt
  }
}

async function connectToNetworks(networks: T.NetworksInfo): Promise<[T.Connections, T.Account[]]> {
  const web3Promises = Object.entries<T.NetworksInfo, T.NetworkType>(networks)
      .map(async ([network, info]): Promise<[T.NetworkType, T.Web3 | undefined]> => {
        try {
          const web3 = await Tesseract.Ethereum.Web3(info.endpoint)
          if (!web3.hasClientWallet) return [network, undefined]
          return [network, web3]
        } catch (error) {
          console.error(error)
          return [network, undefined]
        }
      })
    const web3Array = await Promise.all(web3Promises)

    const workingNet = web3Array.find(net => net[1] !== undefined)
    if (!workingNet) return [{}, []]

    const accounts = (await workingNet[1].eth.getAccounts()).map(pubKey => ({pubKey}))

    const connections = web3Array.reduce<T.Connections>((web3s, [net, web3]) => {
      web3s[net] = web3
      return web3s
    }, {})

    return [connections, accounts]
}

const Index: SFC<never> = () => {
  const [web3Data, setWeb3Data] = useState<Pick<T.AppContextType, 'initialized' | 'connections' | 'accounts' | 'accountIndex' | 'activeNetwork'>>({
    initialized: false,
    connections: {},
    accounts: []
  })
  const [isTablet, setIsTablet] = useState<boolean | null>(null)
  const [ethUsdRate, setEthUsdRate] = useState<number | undefined>()
  const [choosenExampleKey, setChoosenExampleKey] = useState<T.ExampleName>('showBalance')
  const [isCodeOpened, setIsCodeOpened] = useState<boolean>(false)
  
  const router = useRouter()

  const setBalance = useCallback((index: number, balance: number) => {
    setWeb3Data(data => {
      data.accounts[index].balance = balance
      return data
    })
  }, [])
  const setRate = useCallback((rate: number) => {
    setEthUsdRate(rate)
  }, [])

  const updateIsTablet = (): void => setIsTablet(window.innerWidth < 1024)
  
  useEffect(() => { 
    updateIsTablet()
    window.addEventListener('resize', updateIsTablet)
  }, [])

  useEffect(() => { loadNetworks() }, [texts.networks])

  function changeNetwork(network: T.NetworkType): void {
    setWeb3Data(data => ({
      ...data,
      activeNetwork: network,
    }))
  }

  async function loadNetworks(): Promise<void> {
    const [connections, accounts] = await connectToNetworks(texts.networks)

    const connection = Object.entries<T.Connections, T.NetworkType>(connections)
      .find(([, web3]) => web3 !== undefined)

    setWeb3Data({
      initialized: true,
      connections, accounts,
      accountIndex: accounts.length >= 0 ? 0 : undefined,
      activeNetwork: connection ? connection[0] : undefined
    })
  }

  const HOST = /^(http[s]?):\/\/(.+)$/.exec(process.env.BASE_URL)[2]

  const head = (
    <Head>
      <link rel="shortcut icon" href="/favicon.png" />
      <title>Tesseract Demo</title>
      <meta property="og:locale" content="en_US" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Tesseract Demo" />
      <meta name="description" content="Example dApp made with Tesseract SDK" />
      <meta property="og:title" content="Tesseract Demo" />
      <meta property="og:description" content="Example dApp made with Tesseract SDK" />
      <meta property="og:url" content={`${process.env.BASE_URL}${router.asPath}`} />
      <meta property="og:image" content={`http://${HOST}/og_image.png`} />
      <meta property="og:image:secure_url" content={`https://${HOST}/og_image.png`} />
    </Head>
  )

  if (process.browser && !web3Data.initialized || !process.browser) {
    return (<>
      {head}
      <div className={scss.loader}>
        <img className={scss.logo} src="/favicon.png"></img>
        <div className={scss["loader-text-container"]}>
          <div className={scss["loader-text"]}>Initializing...</div>
        </div>
      </div>
    </>)
  }

  return (<>
    {head}
    <T.AppContext.Provider value={{...web3Data, isTablet, ethUsdRate, setBalance, setEthUsdRate: setRate, isCodeOpened, setIsCodeOpened }}>
      <div className={`${scss.container} ${isCodeOpened ? scss['code-opened'] : ''}`}>
        <C.NotificationPopupService>
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
                code={examples[choosenExampleKey].code}
                goGithub={texts.example.goGithub}
                codeLabel={texts.example.codeLabel}
                choosenExampleKey={choosenExampleKey}
                examplesKeys={Object.keys<T.ExamplesText, T.ExampleName>(texts.example.examples)}
                chooseExample={setChoosenExampleKey}
                copyIcon={texts.example.copyIcon}
                texts={isTablet ? texts.example.examples[choosenExampleKey].mobile : undefined }
              >
                {examples[choosenExampleKey].component}
              </C.Example>
            </C.Content>
          </div>
          <div className={`${scss['right-side']}  ${isCodeOpened ? scss['code-opened'] : ''}`}>
            <C.Navigation
              title={texts.example.title}
              slider={
                <C.Slider
                  choosenExampleKey={choosenExampleKey}
                  examples={Object.entries<T.ExamplesText, T.ExampleName>(texts.example.examples)}
                  chooseExample={setChoosenExampleKey}
                />
              }
              sliderDots={
                <C.SliderDots
                  choosenExampleKey={choosenExampleKey}
                  examplesKeys={Object.keys<T.ExamplesText, T.ExampleName>(texts.example.examples)}
                  chooseExample={setChoosenExampleKey}
                />
              }
              networks={
                <C.Networks
                  connections={web3Data.connections}
                  networks={texts.networks}
                  activeNetwork={web3Data.activeNetwork}
                  changeNetwork={changeNetwork}
                />
              }
            />
          </div>
        </C.NotificationPopupService>
      </div>
    </T.AppContext.Provider>
  </>)
}

export default Index