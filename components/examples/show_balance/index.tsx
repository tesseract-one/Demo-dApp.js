import {
  withWeb3Context,
  Web3ContextedComponentClass
} from '../../../hocs'
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

interface IState {
  ethRate: number
  balanceEth: number
  balanceUsd: number
}

export const ShowBalance = withWeb3Context(
  class Component extends Web3ContextedComponentClass<IProps, Nullable<IState>> {
    readonly state = {
      ethRate: null,
      balanceEth: null,
      balanceUsd: null
    }

    async setEthRate() {
      const res = await fetch(this.props.cryptoRateUrl)
      const resJson = res.status === 200 ? await res.json() : null

      if (res.status !== 200 || !resJson.success) {
        setTimeout(async () => {
          await this.setEthRate()
        }, 1000)
        return
      }

      this.setState({ ethRate: parseFloat(resJson.ticker.price) })
    }

    async updateBalance() {
      const { web3, accounts } = this.props.web3Ctx
      const balanceWei = await web3.eth.getBalance(accounts[0])
      const balanceEthAsNumber = parseFloat(web3.utils.fromWei(balanceWei, 'ether'))
      const balanceEth = Math.round(balanceEthAsNumber * 1000000) / 1000000
      const balanceUsd = this.setEthRate
        ? Math.round(balanceEthAsNumber * this.state.ethRate * 100) / 100
        : null
      this.setState({ balanceEth, balanceUsd })
    }

    async componentDidMount() {
      await this.setEthRate()
      await this.updateBalance()
    }

    render() {
      return (
        <div className={scss.container}>
          <span className={scss.title}>
            {this.props.title}
          </span>
          <span className={scss['balance-usd']}>
            {`$${this.state.balanceUsd || 'unknown'}`}
          </span>
          <div className={scss['balance-eth']}>
            <EthereumLogo className={scss.logo} width={44} height={44} viewBox='0 0 44 44' />
            <span className={scss.name}>
              {this.props.currency.name}
            </span>
            <span className={scss.value}>
              {`${this.state.balanceEth || 'unknown'} ${this.props.currency.shortcut}`}
            </span>
          </div>
          <button className={scss.refresh} onClick={this.updateBalance.bind(this)}>
            <span className={`mdi mdi-${this.props.refreshIcon}`} />
          </button>
        </div>
      )
    }
  }
)