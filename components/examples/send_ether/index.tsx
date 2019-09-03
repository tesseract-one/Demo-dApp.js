import React, { SFC, useState, useContext } from 'react'
import { Web3Context } from '../../../pages/index'
import EthereumLogo from '../../../assets/images/ethereum-logo.svg'
import scss from './styles.scss'

interface IProps {
  recipient: {
    title: string
    icon: string
  }
  amount: {
    title: string
    ending: string
  }
  btn: string
}

export const SendEther: SFC<IProps> =
    ({ recipient, amount, btn }) => {
    const [address, setAddress] = useState<string | null>(null)
    const [value, setValue] = useState<string | null>(null)
    const [callback, setCallback] = useState<string | null>(null)

    const { web3, accounts } = useContext(Web3Context)

    async function sendEth() {
      try {
        const sendCallback = await web3.eth.sendTransaction({
          from: accounts[0],
          to: address,
          value: web3.utils.toWei(value, 'ether')
        })
        setCallback(`Transaction was sent successfully: ${sendCallback}`)
      } catch (err) {
        setCallback(`Transaction Error: ${err}`)
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