import React, { SFC, useState, useContext, useEffect } from 'react'
import { AbiItem } from 'web3-utils'
import { Web3Context } from '../../../pages/index'
import abi from '../../../assets/blockchain_cuties_abi.json'
import BlockchainCutiesBanner from '../../../assets/images/blockchain-cuties-banner.jpg'
import BlockchainCutiesLogo from '../../../assets/images/blockchain-cuties-logo.png'
import scss from './styles.scss'

interface IProps {
  address: string
  mobileLabel: string
  balance: {
    label: string
    title: string
  }
  token: {
    name: string
    shortcut: string
  }
  refreshIcon: string
}

export const ShowCuties: SFC<IProps> =
  ({ address, mobileLabel, balance, token, refreshIcon }) => {
    const [cuties, setCuties] = useState<string | null>(null)

    const { web3, accounts, activeNetwork, isMobile } = useContext(Web3Context)

    useEffect(() => {
      async function updateData() {
        activeNetwork === 'main'
        ? await updateCuties()
        : setCuties('NA')
      }
      updateData()
    }, [web3, activeNetwork, accounts])

    async function updateCuties() {
      const blockchainCutiesABI = abi as AbiItem[]
      const contract = new web3.eth.Contract(blockchainCutiesABI, address)
      const cuties = await contract.methods.balanceOf(accounts[0]).call()
      setCuties(cuties)
    }

    if (!isMobile) {
      return (
        <div className={scss.container}>
          <span className={scss.label}>
            {balance.label}
          </span>
          <span className={scss.title}>
            {`${cuties} ${balance.title}`}
          </span>
          <div className={scss.token}>
            <img className={scss.logo} src={BlockchainCutiesLogo} />
            <span className={scss.name}>{token.name}</span>
            <span className={scss.value}>
              {`${cuties || 0} ${token.shortcut}`}
            </span>
          </div>
          <button className={scss.refresh} onClick={updateCuties}>
            <span className={`mdi mdi-${refreshIcon}`} />
          </button>
        </div>
      )
    }

    return (
      <div className={scss.container}>
        <img className={scss.banner} src={BlockchainCutiesBanner} />
        <span className={scss.label}>{mobileLabel}</span>
        <div className={scss.token}>
          <img className={scss.logo} src={BlockchainCutiesLogo} />
          <span className={scss.name}>{token.name}</span>
          <span className={scss.value}>
            {`${cuties || 0} ${token.shortcut}`}
          </span>
        </div>
      </div>
    )
  }