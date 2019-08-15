import * as React from 'react'
import {
  withWeb3Context,
  Web3ContextedComponentClass
} from '../../../hocs'
import { Nullable } from '../../../types'
import EthereumLogo from '../../../assets/images/ethereum-logo.svg'
import SVG from 'react-inlinesvg'
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

interface IState {
  address: string
  amount: string
  sendCallback: string
}

export const SendEther = withWeb3Context(
  class Component extends Web3ContextedComponentClass<IProps, Nullable<IState>> {
    readonly state = {
      address: null,
      amount: null,
      sendCallback: null
    }

    updateAddress(e: React.ChangeEvent<HTMLInputElement>) {
      this.setState({ address: e.target.value })
    }
    
    updateAmount(e: React.ChangeEvent<HTMLInputElement>) {
      this.setState({ amount: e.target.value })
    } 

    async sendEth() {
      const { web3, accounts } = this.props.web3Ctx
      try {
        const sendCallback = await web3.eth.sendTransaction({
          from: accounts[0],
          to: this.state.address,
          value: web3.utils.toWei(this.state.amount, 'ether')
        })
        this.setState({ sendCallback: `Transaction was sent successfully: ${sendCallback}`})
      } catch (err) {
        this.setState({ sendCallback: `Transaction Error: ${err}` })
      }
    }

    render() {
      return (
        <div className={scss.container}>
          <label htmlFor='recipient' className={scss['recipient-title']}>
            {this.props.recipient.title}
          </label>
          <div className={scss['recipient-input']}>
            <span className={`${scss.logo} mdi mdi-${this.props.recipient.icon}`} />
            <input
              id='recipient'
              className={scss.input}
              type='string'
              value={this.state.address || ''}
              onChange={this.updateAddress.bind(this)}
            />
          </div>
          <label htmlFor='amount' className={scss['amount-title']}>
            {this.props.amount.title}
          </label>
          <div className={scss.send}>
            <div className={scss['amount-input']}>
              <SVG className={scss.logo} src={EthereumLogo} />
              <input
                id='amount'
                className={scss.input}
                type='number'
                value={this.state.amount || ''}
                onChange={this.updateAmount.bind(this)}
              />
              <span className={scss.ending}>
                {this.props.amount.ending}
              </span>
            </div>
            <button
              className={scss.btn}
              onClick={this.sendEth.bind(this)}
              disabled={!this.state.address || !this.state.amount}
            >
              {this.props.btn}
            </button>
          </div>
        </div>
      )
    }
  }
)