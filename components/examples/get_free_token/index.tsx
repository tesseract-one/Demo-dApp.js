import React, { SFC, ReactElement, SVGAttributes, useContext } from 'react'
import { Web3Context } from '../../../pages'
import { AbiItem } from 'web3-utils'
import { KFreeToken, KNetwork, FreeTokens, Nullable } from '../../../types'
import WeenusIcon from '../../../assets/images/weenus-icon.svg'
import XeenusIcon from '../../../assets/images/xeenus-icon.svg'
import YeenusIcon from '../../../assets/images/yeenus-icon.svg'
import ZeenusIcon from '../../../assets/images/zeenus-icon.svg'
import tokensAbi from '../../../assets/free_tokens_abi.json'
import scss from './styles.scss'

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

const icons: Record<KFreeToken, ReactElement<SVGAttributes<SVGAElement>>> = {
  weenus: <WeenusIcon {...iconsProps} />,
  xeenus: <XeenusIcon {...iconsProps} />,
  yeenus: <YeenusIcon {...iconsProps} />,
  zeenus: <ZeenusIcon {...iconsProps} />
}

type TokensBalance = Record<KFreeToken, string>

type TokensAbi = Record<KNetwork, Record<KFreeToken, AbiItem[]>>

export const GetFreeToken: SFC<IProps> = ({ title, tokens }) => {
  const { web3, accounts, activeNetwork, isTablet } = useContext(Web3Context)

  const [balance, setBalance] = React.useState<Nullable<TokensBalance>>(null)

  React.useEffect(() => {
    async function updateData(): Promise<void> {
      await updateBalance()
    }
    updateData()
  }, [web3, activeNetwork, accounts])

  async function updateBalance(): Promise<void> {
    const promises = Object.entries((tokensAbi as TokensAbi)[activeNetwork]).map(([tokenName, abi]) =>
      updateTokenBalance((abi as AbiItem[]), tokenName)
    )
    await Promise.all(promises)
  }

  async function updateTokenBalance(abi: AbiItem[], tokenName: KFreeToken): Promise<void> {
    const contract = new web3.eth.Contract(abi as AbiItem[], tokens[tokenName as string].addresses[activeNetwork])
    const tokenBalanceWei = await contract.methods.balanceOf(accounts[0]).call()
    const tokenBalance = parseFloat(web3.utils.fromWei(tokenBalanceWei, 'ether'))
    const roundedTokenBalance = Math.round(tokenBalance * 1000) / 1000
    setBalance(b => ({...b, [tokenName]: roundedTokenBalance }))
  }

  async function getToken(tokenName: KFreeToken, address: string): Promise<void> {
    const tx = {
      from: accounts[0],
      to: address,
      value: web3.utils.toWei('0', 'ether')
    }
    try {
      const estimatedGas = await web3.eth.estimateGas(tx)
      await web3.eth.sendTransaction({
        ...tx,
        gas: (estimatedGas * 1.3).toFixed(0).toString()
      })
      await updateTokenBalance(tokensAbi[activeNetwork][tokenName] as AbiItem[], tokenName)
      console.log(`Transaction was sent successfully.`)
    } catch (err) {
      console.log(`Transaction Error: ${err}`)
    }
  }

  if (!isTablet) {
    return (
      <div className={scss.container}>
        <span className={scss.title}>{title}</span>
        <ul className={scss.tokens}>
          {Object.entries<FreeTokens, KFreeToken>(tokens).map(
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
                {balance &&
                  <span className={scss.balance}>
                    {balance[key]}
                  </span>
                }
              </li>
            )
          )}
        </ul>
      </div>
    )
  }

  return (
    <ul className={scss.tokens}>
      {Object.entries<FreeTokens, KFreeToken>(tokens).map(([key, val]) => (
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
        </li>
      ))}
    </ul>
  )
}
