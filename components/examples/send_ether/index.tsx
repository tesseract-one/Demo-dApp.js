import React, { SFC, ChangeEvent, useState, useContext } from 'react'
import { AppContext } from '../../../types'
import EthereumLogo from '../../../assets/images/ethereum-logo.svg'
import scss from './styles.scss'
import { NotificationPopupData, NotificationContext } from '../../notification_popup'
import { notification } from '../../../assets/texts.json'

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
}

export const SendEther: SFC<IProps> =
    ({ recipient, amount, btn }) => {
    const { connections, activeNetwork, accountIndex, accounts, isTablet } = useContext(AppContext)
    const { showPopup } = useContext(NotificationContext)

    const web3 = activeNetwork ? connections[activeNetwork] : undefined
    const account = accountIndex !== undefined ? accounts[accountIndex] : undefined

    const [address, setAddress] = useState<string | null>(null)
    const [value, setValue] = useState<string | null>(null)
    const [updating, setUpdating] = useState<boolean>(false)

    async function sendEth(): Promise<void> {
      try {
        setUpdating(true)

        await web3.eth.sendTransaction({
          from: account.pubKey,
          to: address,
          value: web3.utils.toWei(value, 'ether')
        })

        showPopup && showPopup({
          ...notification.sucess,
          description: 'All went smooth! Check out your balance and enjoy.'
        })
      } catch (err) {
        showPopup && showPopup({ ...notification.failure, description: err.message })
        console.log('Transaction Error', err)
      } finally {
        setUpdating(false)
      }
    }
    
    function updateAddress(e: ChangeEvent<HTMLInputElement>): void {
      setAddress(e.target.value)
    }

    function updateAmount(e: ChangeEvent<HTMLInputElement>): void {
      setValue(e.target.value)
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
            onChange={updateAddress}
            disabled={updating}
          />
        </div>
        <label htmlFor='amount' className={scss['amount-title']}>
          {amount.title}
        </label>
        <div className={scss.send}>
          <div className={scss['amount-input']}>
            <EthereumLogo
              className={scss.logo}
              width={44}
              height={44}
              viewBox='0 0 44 44'
            />
            <input
              id='amount'
              className={scss.input}
              type='number'
              placeholder={amount.placeholder}
              value={value || ''}
              onChange={updateAmount}
              disabled={updating}
            />
            <span className={scss.ending}>
              {amount.ending}
            </span>
          </div>
          <button
            className={scss.btn}
            onClick={sendEth}
            disabled={!address || !value || updating}
          >
            {updating ? (
              <span className={`mdi mdi-refresh spinning ${scss.progress}`} />
            ) : (
              btn
            )}
          </button>
        </div>
      </div>
    )
  }