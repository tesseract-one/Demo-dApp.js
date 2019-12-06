import React, { SFC, useState, useContext, useEffect } from 'react'
import { AppContext } from '../../../types'
import EthereumLogo from '../../../assets/images/ethereum-logo.svg'
import EthereumLogoMobile from '../../../assets/images/ethereum-logo-mobile.svg'
import ShowBalanceImg from '../../../assets/images/show-balance-mobile.jpg'
import scss from './styles.scss'

type Props = {
  title: string
  label: string
  currency: {
    name: string
    shortcut: string
  }
  cryptoRateUrl: string
  refreshIcon: string
}

function roundBalance(isTablet: boolean, balance: number): number {
  const round = isTablet ? 100 : 1000000
  return Math.round(balance * round) / round
}

export const ShowBalance: SFC<Props> =
  ({ title, label, currency, cryptoRateUrl, refreshIcon }) => {
    const context = useContext(AppContext)

    const currentBalance = context.accountIndex !== undefined
      ? context.accounts[context.accountIndex].balance
      : undefined 

    const currentUsdBalance = currentBalance !== undefined && context.ethUsdRate !== undefined
      ? Math.round(currentBalance * context.ethUsdRate * 100) / 100
      : undefined

    const [ethRate, setEthRate] = useState<number | undefined>(context.ethUsdRate)
    const [ethBalance, setEthBalance] = useState<number | undefined>(currentBalance)
    const [usdBalance, setUsdBalance] = useState<number | undefined>(currentUsdBalance)
    
    useEffect(() => { updateEthRate() }, [])

    useEffect(() => {
      if (context.activeNetwork && context.accountIndex !== undefined) updateBalance()
    }, [context.activeNetwork, context.connections, context.accounts, context.accountIndex])

    useEffect(() => {
      const balanceUsd = ethRate !== undefined && ethBalance !== undefined
        ? Math.round(ethBalance * ethRate * 100) / 100
        : undefined
      setUsdBalance(balanceUsd)
    }, [ethRate, ethBalance])

    async function updateEthRate(): Promise<void> {
      const res = await fetch(cryptoRateUrl)
      const resJson = res.status === 200 ? await res.json() : null

      if (res.status !== 200 || !resJson.success) {
        setTimeout(updateEthRate, 1000)
        return
      }

      const rate = parseFloat(resJson.ticker.price)
      context.setEthUsdRate(rate)
      setEthRate(rate)
    }

    async function updateBalance(): Promise<void> {
      const web3 = context.activeNetwork ? context.connections[context.activeNetwork] : undefined
      const account = context.accountIndex !== undefined ? context.accounts[context.accountIndex] : undefined
      if (!account || !web3) return

      const balanceWei = await web3.eth.getBalance(account.pubKey)
      const balance = parseFloat(web3.utils.fromWei(balanceWei, 'ether'))

      context.setBalance(context.accountIndex, balance)
      setEthBalance(balance)
    }

    if (!context.isTablet) {
      return (
        <div className={scss.container}>
          <span className={scss.title}>
            {title}
          </span>
          <span className={scss['balance-usd']}>
            {`$${usdBalance === undefined ? 'NA' : usdBalance}`}
          </span>
          <div className={scss['balance-eth']}>
            <EthereumLogo
              className={scss.logo}
              width={44}
              height={44}
              viewBox='0 0 44 44'
            />
            <span className={scss.name}>
              {currency.name}
            </span>
            <span className={scss.value}>
              {`${ethBalance === undefined ? 'NA' : roundBalance(context.isTablet, ethBalance)} ${currency.shortcut}`}
            </span>
          </div>
          <button className={scss.refresh} onClick={updateBalance}>
            <span className={`mdi mdi-${refreshIcon} ${scss.icon}`} />
          </button>
        </div>
      )
    }

    return (
      <div className={scss.container}>
        <img className={scss.image} src={ShowBalanceImg} />
        <div className={scss['balance-container']}>
          <span className={scss.label}>{label}</span>
          <div className={scss['balance-eth']}>
            <div className={scss['logo-container']}>
              <EthereumLogoMobile
                className={scss.logo}
                width={17}
                height={28}
                viewBox='0 0 17 28'
              />
            </div>
            <span className={scss.name}>
              {currency.name}
            </span>
            <span className={scss.value}>
              {`${ethBalance === undefined ? 'NA' : roundBalance(context.isTablet, ethBalance)} ${currency.shortcut}`}
            </span>
          </div>
        </div>
      </div>
    )
  }