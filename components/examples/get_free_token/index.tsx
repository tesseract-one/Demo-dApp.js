import React, { SFC, ReactElement, SVGAttributes, useContext, useState, useEffect } from 'react'
import { AppContext, Web3 } from '../../../types'
import { AbiItem } from 'web3-utils'
import { FreeTokenType, NetworkType, FreeTokens } from '../../../types'
import { NotificationContext } from '../../notification_popup'
import WeenusIcon from '../../../assets/images/weenus-icon.svg'
import XeenusIcon from '../../../assets/images/xeenus-icon.svg'
import YeenusIcon from '../../../assets/images/yeenus-icon.svg'
import ZeenusIcon from '../../../assets/images/zeenus-icon.svg'
import tokensAbi from '../../../assets/free_tokens_abi.json'
import scss from './styles.scss'
import { notification } from '../../../assets/texts.json'

interface IProps {
  title: string
  tokens: FreeTokens
}

const iconsProps = {
  className: scss.image,
  width: 44,
  height: 36,
  viewBox: '0 0 44 36'
}

const icons: Record<FreeTokenType, ReactElement<SVGAttributes<SVGAElement>>> = {
  weenus: <WeenusIcon {...iconsProps} />,
  xeenus: <XeenusIcon {...iconsProps} />,
  yeenus: <YeenusIcon {...iconsProps} />,
  zeenus: <ZeenusIcon {...iconsProps} />
}

type TokensBalance = Record<FreeTokenType, number>

type TokensAbi = Record<NetworkType, Record<FreeTokenType, AbiItem[]>>

async function getTokenBalance(
  web3: Web3, network: NetworkType, account: string, tokens: FreeTokens, abi: AbiItem[], tokenName: FreeTokenType
): Promise<number> {
  const contract = new web3.eth.Contract(abi as AbiItem[], tokens[tokenName as string].addresses[network])
  const decimals = Web3.utils.toBN(await contract.methods.decimals().call())
  const tokenBalanceTokens = Web3.utils.toBN(await contract.methods.balanceOf(account).call())
  return tokenBalanceTokens.div(Web3.utils.toBN(10).pow(decimals)).toNumber()
}

export const GetFreeToken: SFC<IProps> = ({ title, tokens }) => {
  const { connections, accounts, accountIndex, activeNetwork, isTablet } = useContext(AppContext)
  const { showPopup } = useContext(NotificationContext)

  const web3 = activeNetwork ? connections[activeNetwork] : undefined
  const account = accountIndex !== undefined ? accounts[accountIndex] : undefined

  const [balance, setBalance] = useState<Partial<TokensBalance>>(null)
  const [updating, setUpdating] = useState<Record<string, boolean>>({})

  useEffect(updateBalance, [web3, account])

  function updateBalance() {
    if (!activeNetwork) return

    Object.entries((tokensAbi as TokensAbi)[activeNetwork])
      .forEach(([tokenName, abi]) => 
        updateTokenBalance(abi as AbiItem[], tokenName)
      )
  }

  async function updateTokenBalance(abi: AbiItem[], tokenName: FreeTokenType): Promise<void> {
    if (!web3 || !account) return

    setUpdating(updating => ({ ...updating, [tokenName]: true }))

    const balance = await getTokenBalance(web3, activeNetwork, account.pubKey, tokens, abi, tokenName)
    
    setBalance(b => ({...b, [tokenName]: balance }))
    setUpdating(updating => ({ ...updating, [tokenName]: false }))
  }

  async function getToken(tokenName: FreeTokenType, address: string): Promise<void> {
    if (updating[tokenName]) return;
    const tx = {
      from: account.pubKey,
      to: address,
      value: web3.utils.toWei('0', 'ether')
    }
    try {
      setUpdating(updating => ({ ...updating, [tokenName]: true }))
      const estimatedGas = await web3.eth.estimateGas(tx)
      await web3.eth.sendTransaction({
        ...tx,
        gas: (estimatedGas * 1.3).toFixed(0).toString()
      })
      await updateTokenBalance(tokensAbi[activeNetwork][tokenName] as AbiItem[], tokenName)

      showPopup && showPopup({
        ...notification.sucess,
        description: 'Transaction was sent successfully.'
      })
      console.log(`Transaction was sent successfully.`)
    } catch (err) {
      showPopup && showPopup({ ...notification.failure, description: err.message })
      console.log('Transaction Error', err)
    } finally {
      setUpdating(updating => ({ ...updating, [tokenName]: false }))
    }
  }

  if (!isTablet) {
    return (
      <div className={scss.container}>
        <span className={scss.title}>{title}</span>
        <ul className={scss.tokens}>
          {Object.entries<FreeTokens, FreeTokenType>(tokens).map(
            ([key, value]) => (
              <li
                className={scss.token}
                key={value.title}
                onClick={getToken.bind(null, key, value.addresses[activeNetwork])}
              >
                <div className={scss.logo}>
                  {icons[key]}
                  <span className={scss['logo-symb']}>{value.logo}</span>
                </div>
                {value.title}
                <span className={scss.balance}>
                  {updating[key] ? (
                    <i className={`mdi mdi-refresh spinning ${scss.progress}`}></i>
                  ) : (
                    balance ? balance[key] : ''
                  )}
                </span>
              </li>
            )
          )}
        </ul>
      </div>
    )
  }

  return (
    <ul className={scss.tokens}>
      {Object.entries<FreeTokens, FreeTokenType>(tokens).map(([key, val]) => (
        <li
          className={scss.token}
          key={val.title}
          onClick={getToken.bind(null, key, val.addresses[activeNetwork])}
        >
          <div className={scss.content}>
            <div className={scss.logo}>
              {icons[key]}
              <span className={scss['logo-symb']}>{val.logo}</span>
            </div>
            <span className={scss.title}>{`${balance ? balance[key] : ''} ${val.title}`}</span>
          </div>
          {updating[key] ? (<div className={scss['progress-container']}>
            <span className={`mdi mdi-refresh spinning ${scss.progress}`}></span>
          </div>) : ''}
        </li>
      ))}
    </ul>
  )
}
