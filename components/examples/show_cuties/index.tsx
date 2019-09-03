import abi from '../../../assets/blockchain_cuties_abi.json'
import { AbiItem } from 'web3-utils'
import { 
  withWeb3Context,
  Web3ContextedComponentClass
} from '../../../hocs'
import BlockchainCutiesLogo from '../../../assets/images/blockchain-cuties-logo.png'
import { Nullable } from '../../../types'
import scss from './styles.scss'

interface IProps {
  address: string
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

interface IState {
  cuties: number
}

export const ShowCuties = withWeb3Context<IProps>(
  class Component extends Web3ContextedComponentClass<IProps, Nullable<IState>> {
    readonly state: Nullable<IState> = {
      cuties: null
    }

    async updateCuties() {
      const { web3, accounts } = this.props.web3Ctx
      const blockchainCutiesABI = abi as AbiItem[]
      const contract = new web3.eth.Contract(blockchainCutiesABI, this.props.address)
      const cuties = await contract.methods.balanceOf(accounts[0]).call()
      this.setState({ cuties })
    }

    async componentDidMount() {
      await this.updateCuties()
    }

    render() {
      const { balance, token, refreshIcon } = this.props

      return (
        <div className={scss.container}>
          <span className={scss.label}>
            {balance.label}
          </span>
          <span className={scss.title}>
            {`${this.state.cuties} ${balance.title}`}
          </span>
          <div className={scss.token}>
            <img className={scss.logo} src={BlockchainCutiesLogo} />
            <span className={scss.name}>{token.name}</span>
            <span className={scss.value}>
              {`${this.state.cuties || 0} ${token.shortcut}`}
            </span>
          </div>
          <button className={scss.refresh} onClick={this.updateCuties.bind(this)}>
            <span className={`mdi mdi-${refreshIcon}`} />
          </button>
        </div>
      )
    }
  }
)