import React, { SFC, ReactElement, SVGAttributes, useContext } from 'react'
import { Web3Context } from '../../../pages' 
import { KFreeToken, FreeTokens } from '../../../types'
import WeenusIcon from '../../../assets/images/weenus-icon.svg'
import XeenusIcon from '../../../assets/images/xeenus-icon.svg'
import YeenusIcon from '../../../assets/images/yeenus-icon.svg'
import ZeenusIcon from '../../../assets/images/zeenus-icon.svg'
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
  weenus: <WeenusIcon { ...iconsProps } />,
  xeenus: <XeenusIcon { ...iconsProps } />,
  yeenus: <YeenusIcon { ...iconsProps } />,
  zeenus: <ZeenusIcon { ...iconsProps } />
}

export const GetFreeToken: SFC<IProps> =
    ({ title, tokens }) => {
    const { web3, accounts, isMobile } = useContext(Web3Context)

    async function getToken(address: string): Promise<void> {
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
        console.log(`Transaction was sent successfully.`)
      } catch (err) {
        console.log(`Transaction Error: ${err}`)
      }
    }

    if (!isMobile) {
      return (
        <div className={scss.container}>
          <span className={scss.title}>
            {title}
          </span>
          <ul className={scss.tokens}>
            {
              Object.entries<FreeTokens, KFreeToken>(tokens)
                .map(([key, value]) => (
                  <li
                    className={`${scss.token} ${scss[key]}`}
                    key={value.title}
                    onClick={getToken.bind(null, value.addresses.rinkeby)}
                  >
                    <div className={scss.logo}>
                      {value.logo}
                    </div>
                    {value.title}
                  </li>
                ))
            }
          </ul>
        </div>
      )
    }

    return (
      <ul className={scss.tokens}>
        {
          Object.entries<FreeTokens, KFreeToken>(tokens)
            .map(([key, val]) => (
              <li
                className={`${scss.token} ${scss[key]}`}
                key={val.title}
                onClick={getToken.bind(null, val.addresses.rinkeby)}
              >
                <div className={scss.content}>
                  {icons[key]}
                  <span className={scss.title}>
                    {val.mobileTitle}
                  </span>
                </div>
              </li>
            ))
        }
      </ul>
    )
  }