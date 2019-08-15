import * as React from 'react'
import {
  INetworks,
  KNetwork,
  IWeb3s
} from '../../types'
import scss from './styles.scss'

interface IProps {
  web3s: IWeb3s
  networks: INetworks
  activeNetwork: KNetwork,
  changeNetwork: (network: KNetwork) => void
}

interface IState {
  isOpen: boolean
}

export class Networks extends React.Component<IProps, IState> {
  readonly state = {
    isOpen: false
  }

  changeNetwork(network: KNetwork) {
    if (this.props.web3s[network] === null) return
    this.props.changeNetwork(network)
    this.toggleNetworks
  }
  
  toggleNetworks() {
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  render () {
    return (
      <div className={`${scss.container} ${this.state.isOpen ? '' : scss.closed}`}>
        <button className={scss['active-network']} onClick={this.toggleNetworks.bind(this)}>
          {this.props.networks[this.props.activeNetwork].name}
          <span className={`${scss['up-icon']} mdi mdi-chevron-up`} />
        </button>
        <ul className={scss.networks}>
          {
            Object.entries<INetworks, KNetwork>(this.props.networks)
             .map(network =>
                <li
                  className={`${scss.network}
                    ${this.props.activeNetwork === network[0] ? scss.active : ''}
                    ${this.props.web3s[network[0]] === null ? scss.off : scss.on}`}
                  onClick={this.changeNetwork.bind(this, network[0])}
                  key={network[0]}
                >
                  {network[1].name}
                </li>
              )
          }
        </ul>
      </div>
    )
  }
}