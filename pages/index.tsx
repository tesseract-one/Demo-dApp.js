import React, { SFC, ReactElement, useState, useEffect } from 'react'
import { Tesseract } from '@tesseractjs/ethereum-web3'
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

export const Web3Context = React.createContext<T.IWeb3Context | null>(null)

const Index: SFC<never> = () => {
  const [web3Data, setWeb3Data] = useState<Omit<T.IWeb3Context, 'web3s' | 'isTablet' | 'setPopup'>>({
    web3: null,
    accounts: [],
    activeNetwork: null
  })
  const [isTablet, setIsTablet] = useState<boolean | null>(null)
  const [web3s, setWeb3s] = useState<T.Web3s | null>(null)
  const [choosenExampleKey, setChoosenExampleKey] = useState<T.KExample>('showBalance')
  const [notificationPopup, setNotificationPopup] = useState<ReactElement<T.INotificationPopup> | null>(null)

  useEffect(() => {
    setIsTablet(window.innerWidth < 1024)
  }, [])

  useEffect(() => {
    async function updateData(): Promise<void> {
      await loadNetworks()
    }
    updateData()
  }, [texts.networks])

  useEffect(() => {
    if (web3s === null) return
    chooseDefaultNetwork()
  }, [web3s])

  function changeNetwork(network: T.KNetwork): void {
    setWeb3Data({
      web3: web3s[network].web3,
      accounts: web3s[network].accounts,
      activeNetwork: network
    })
  }

  function chooseDefaultNetwork(): void {
    const network = Object.entries<T.Web3s, T.KNetwork>(web3s)
      .find(([, web3]) => web3 !== null)

    if (!network) return
  
    setWeb3Data({
      web3: network[1].web3,
      accounts: network[1].accounts,
      activeNetwork: network[0]
    })
  }

  async function loadNetworks(): Promise<void> {
    const web3sArray = await Promise.all(
      Object.entries<T.Networks, T.KNetwork>(texts.networks)
        .map(async (network): Promise<Partial<T.Web3s>> => 
          {
            try {
              const web3 = await Tesseract.Ethereum.Web3(network[1].endpoint)
              if (!web3.hasClientWallet) return { [network[0]]: null }
              const accounts = await web3.eth.getAccounts()
              return { [network[0]]: { web3, accounts } }
            } catch (error) {
              console.error(error)
              return { [network[0]]: null }
            }
          }
        )
    )
    const web3s = web3sArray
      .reduce<Partial<T.Web3s>>((acc, web3) => ({ ...acc, ...web3 }), {}) as T.Web3s

    setWeb3s(web3s)
  }

  function setPopup(data: T.INotificationPopup): void {
    setNotificationPopup(<C.NotificationPopup { ...data } />)
    setTimeout(() => {
      setNotificationPopup(null)
    }, 3000)
  }

  // if (!web3Data.web3) return (
  //   <h1>Waiting for web3 initialization ...</h1>
  // )
  if(isTablet === null) return null

  return (
    <Web3Context.Provider value={{...web3Data, web3s, isTablet, setPopup}}>
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
              code={examples[choosenExampleKey].code}
              goGithub={texts.example.goGithub}
              codeLabel={texts.example.codeLabel}
              choosenExampleKey={choosenExampleKey}
              examplesKeys={Object.keys<T.ExamplesText, T.KExample>(texts.example.examples)}
              chooseExample={setChoosenExampleKey}
              copyIcon={texts.example.copyIcon}
              texts={isTablet ? texts.example.examples[choosenExampleKey].mobile : undefined }
            >
              {examples[choosenExampleKey].component}
            </C.Example>
          </C.Content>
        </div>
        <div className={scss['right-side']}>
          <C.Navigation
            title={texts.example.title}
            slider={
              <C.Slider
                choosenExampleKey={choosenExampleKey}
                examples={Object.entries<T.ExamplesText, T.KExample>(texts.example.examples)}
                chooseExample={setChoosenExampleKey}
              />
            }
            sliderDots={
              <C.SliderDots
                choosenExampleKey={choosenExampleKey}
                examplesKeys={Object.keys<T.ExamplesText, T.KExample>(texts.example.examples)}
                chooseExample={setChoosenExampleKey}
              />
            }
            networks={
              <C.Networks
                web3s={web3s}
                networks={texts.networks}
                activeNetwork={web3Data.activeNetwork}
                changeNetwork={changeNetwork}
              />
            }
          />
        </div>
        {notificationPopup}
      </div>
    </Web3Context.Provider>
  )
}

export default Index