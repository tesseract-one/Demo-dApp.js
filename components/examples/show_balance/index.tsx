import React, { SFC, useState, useContext, useEffect } from 'react'
import { Web3Context } from '../../../pages/index'
import { Nullable } from '../../../types'
import EthereumLogo from '../../../assets/images/ethereum-logo.svg'
import EthereumLogoMobile from '../../../assets/images/ethereum-logo-mobile.svg'
import ShowBalanceImg from '../../../assets/images/show-balance-mobile.jpg'
import scss from './styles.scss'

interface IProps {
  title: string
  label: string
  currency: {
    name: string
    shortcut: string
  }
  cryptoRateUrl: string
  refreshIcon: string
}

interface IBalance {
  eth: number
  usd: number
}

export const ShowBalance: SFC<IProps> =
  ({ title, label, currency, cryptoRateUrl, refreshIcon }) => {
    const [ethRate, setEthRate] = useState<number | null>(null)
    const [balance, setBalance] = useState<Nullable<IBalance>>({
      eth: null,
      usd: null
    })
    const { web3, accounts, isMobile } = useContext(Web3Context)

    useEffect(() => {
      async function updateData() {
        await updateEthRate()
      }
      updateData()
    }, [])

    useEffect(() => {
      async function updateData() {
        await updateBalance()
      }
      web3 && updateData()
    }, [web3, accounts, ethRate])

    async function updateEthRate() {
      const res = await fetch(cryptoRateUrl)
      const resJson = res.status === 200 ? await res.json() : null

      if (res.status !== 200 || !resJson.success) {
        setTimeout(async () => {
          await updateEthRate()
        }, 1000)
        return
      }

      setEthRate(parseFloat(resJson.ticker.price))
    }

    async function updateBalance() {
      const round = isMobile ? 10 : 1000000
      const balanceWei = await web3.eth.getBalance(accounts[0])
      const balanceEthAsNumber = parseFloat(web3.utils.fromWei(balanceWei, 'ether'))
      const balanceEth = Math.round(balanceEthAsNumber * round) / round
      const balanceUsd = ethRate
        ? Math.round(balanceEthAsNumber * ethRate * 100) / 100
        : null
      setBalance({ eth: balanceEth, usd: balanceUsd })
    }

    if (!isMobile) {
      return (
        <div className={scss.container}>
          <span className={scss.title}>
            {title}
          </span>
          <span className={scss['balance-usd']}>
            {`$${balance.usd || 'NA'}`}
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
              {`${balance.eth || 'NA'} ${currency.shortcut}`}
            </span>
          </div>
          <button className={scss.refresh} onClick={updateBalance}>
            <span className={`mdi mdi-${refreshIcon}`} />
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
              {`${balance.eth !== null ? balance.eth : 'NA'} ${currency.shortcut}`}
            </span>
          </div>
        </div>
      </div>
    )
  }