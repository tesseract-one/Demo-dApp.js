import React, { SFC, useState, useContext, useEffect } from 'react'
import { Web3Context } from '../../../pages/index'
import { Nullable } from '../../../types'
import EthereumLogo from '../../../assets/images/ethereum-logo.svg'
import scss from './styles.scss'

interface IProps {
  title: string
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
  ({ title, currency, cryptoRateUrl, refreshIcon }) => {
    const [ethRate, setEthRate] = useState<number | null>(null)
    const [balance, setBalance] = useState<Nullable<IBalance>>({
      eth: null,
      usd: null
    })
    const { web3, accounts } = useContext(Web3Context)

    useEffect(() => {
      async function updateData() {
        await updateEthRate()
        await updateBalance()
      }
      updateData()
    }, [web3, accounts])

    useEffect(() => {
      async function updateData() {
        await updateBalance()
      }
      updateData()
    }, [ethRate])

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
      const balanceWei = await web3.eth.getBalance(accounts[0])
      const balanceEthAsNumber = parseFloat(web3.utils.fromWei(balanceWei, 'ether'))
      const balanceEth = Math.round(balanceEthAsNumber * 1000000) / 1000000
      const balanceUsd = ethRate
        ? Math.round(balanceEthAsNumber * ethRate * 100) / 100
        : null
      setBalance({ eth: balanceEth, usd: balanceUsd })
    }

    return (
      <div className={scss.container}>
        <span className={scss.title}>
          {title}
        </span>
        <span className={scss['balance-usd']}>
          {`$${balance.usd || 'unknown'}`}
        </span>
        <div className={scss['balance-eth']}>
          <EthereumLogo className={scss.logo} width={44} height={44} viewBox='0 0 44 44' />
          <span className={scss.name}>
            {currency.name}
          </span>
          <span className={scss.value}>
            {`${balance.eth || 'unknown'} ${currency.shortcut}`}
          </span>
        </div>
        <button className={scss.refresh} onClick={updateBalance}>
          <span className={`mdi mdi-${refreshIcon}`} />
        </button>
      </div>
    )
  }