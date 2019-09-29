import React, { SFC, useState, useContext } from 'react'
import { Web3Context } from '../../../pages/index'
import EthereumLogo from '../../../assets/images/ethereum-logo.svg'
import scss from './styles.scss'
import { INotificationPopup } from '../../../types'

interface IProps {
  recipient: {
    title: string
    placeholder: string
    icon: string
  }
  amount: {
    title: string
    placeholder: string
    ending: string
  }
  btn: string
  resultPopup: {
    sucessful: INotificationPopup
  }
}

export const SendEther: SFC<IProps> =
    ({ recipient, amount, btn, resultPopup }) => {
    const { web3, accounts, setPopup, isMobile } = useContext(Web3Context)

    const [address, setAddress] = useState<string | null>(null)
    const [value, setValue] = useState<string | null>(null)

    async function sendEth() {
      try {
        await web3.eth.sendTransaction({
          from: accounts[0],
          to: address,
          value: web3.utils.toWei(value, 'ether')
        })

        if (isMobile) {
          setPopup(resultPopup.sucessful)
        }
      } catch (err) {
        console.log(`Transaction Error: ${err}`)
      }
    }

    return (
      <div className={scss.container}>
        <label htmlFor='recipient' className={scss['recipient-title']}>
          {recipient.title}
        </label>
        <div className={scss['recipient-input']}>
          <span className={`${scss.logo} mdi mdi-${recipient.icon}`} />
          <input
            id='recipient'
            className={scss.input}
            type='string'
            placeholder={recipient.placeholder}
            value={address || ''}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
        <label htmlFor='amount' className={scss['amount-title']}>
          {amount.title}
        </label>
        <div className={scss.send}>
          <div className={scss['amount-input']}>
            <EthereumLogo className={scss.logo} />
            <input
              id='amount'
              className={scss.input}
              type='number'
              placeholder={amount.placeholder}
              value={value || ''}
              onChange={e => setValue(e.target.value)}
            />
            <span className={scss.ending}>
              {amount.ending}
            </span>
          </div>
          <button
            className={scss.btn}
            onClick={sendEth}
            disabled={!address || !value}
          >
            {btn}
          </button>
        </div>
      </div>
    )
  }