import React, { SFC, useState, useContext } from 'react'
import { Web3Context } from '../../../pages' 
import { KFreeToken, IFreeTokens } from '../../../types'
import scss from './styles.scss'

interface IProps {
  title: string
  tokens: IFreeTokens
}

export const GetFreeToken: SFC<IProps> =
    ({ title, tokens }) => {
    const [sendCallback, setSendCallback] = useState<string | null>(null)

    const { web3, accounts } = useContext(Web3Context)

    async function getToken(address: string) {
      const tx = {
        from: accounts[0],
        to: address,
        value: web3.utils.toWei('0', 'ether')
      }
      try {
        const estimatedGas = await web3.eth.estimateGas(tx)
        const sendCallback = await web3.eth.sendTransaction({
          ...tx,
          gas: (estimatedGas * 1.3).toFixed(0).toString()
        })
        setSendCallback(`Transaction was sent successfully: ${sendCallback}`)
      } catch (err) {
        setSendCallback(`Transaction Error: ${err}`)
      }
    }

    return (
      <div className={scss.container}>
        <span className={scss.title}>
          {title}
        </span>
        <ul className={scss.tokens}>
          {
            Object.entries<IFreeTokens, KFreeToken>(tokens)
              .map(token => (
                <li
                  className={`${scss.token} ${scss[token[0]]}`}
                  key={token[1].title}
                  onClick={getToken.bind(null, token[1].addresses.rinkeby)}
                >
                  <div className={scss.logo}>
                    {token[1].logo}
                  </div>
                  {token[1].title}
                </li>
              ))
          }
        </ul>
      </div>
    )
  }