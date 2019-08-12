import { withWeb3Context, Web3ContextedComponentClass } from '../../../hocs/with_web3_context'
import scss from './styles.scss'

interface Props {
  title: string
  tokens: {
    [key: string]: {
      title: string
      logo: string
      addresses: {
        [key: string]: string
      }
    }
  }
}
type State = {
  sendCallback: string
}

export const GetFreeToken = withWeb3Context(
  class Component extends Web3ContextedComponentClass<Props, State> {
    readonly state = {
      sendCallback: ''
    }

    async getToken(address: string) {
      const { web3, accounts } = this.props.web3Ctx
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
        this.setState({ sendCallback: `Transaction was sent successfully: ${sendCallback}`})
      } catch (err) {
        this.setState({ sendCallback: `Transaction Error: ${err}` })
      }
    }

    render() {
      return (
        <div className={scss.container}>
          <span className={scss.title}>
            {this.props.title}
          </span>
          <ul className={scss.tokens}>
            {
              Object.entries(this.props.tokens).map(token => (
                <li
                  className={`${scss.token} ${scss[token[0]]}`}
                  key={token[1].title}
                  onClick={this.getToken.bind(this, token[1].addresses.rinkeby)}
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
  }
)