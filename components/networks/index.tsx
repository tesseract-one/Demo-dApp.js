import * as React from 'react'
import { INetwork } from '../../types'
import scss from './styles.scss'

interface Props {
  networks: INetwork[]
  changeNetwork: (networkEndpoint: string) => void
}

interface State {
  isOpen: boolean
  activeNetwork: string
}

export class Networks extends React.Component<Props, State> {
  readonly state = {
    isOpen: false,
    activeNetwork: this.props.networks[0].name
  }

  changeNetwork(network: INetwork) {
    this.props.changeNetwork(network.endpoint)
    this.setState({ activeNetwork: network.name }, this.toggleNetworks)
  }
  
  toggleNetworks() {
    this.setState(state => ({ isOpen: !state.isOpen }))
  }

  render () {
    return (
      <div className={`${scss.container} ${this.state.isOpen ? '' : scss.closed}`}>
        <button className={scss['active-network']} onClick={this.toggleNetworks.bind(this)}>
          {this.state.activeNetwork}
          <span className={`${scss['up-icon']} mdi mdi-chevron-up`} />
        </button>
        <ul className={scss.networks}>
          {
            this.props.networks.map(network =>
              <li
                className={`${scss.network} ${this.state.activeNetwork === network.name ? scss.active : ''}`}
                onClick={this.changeNetwork.bind(this, network)}
                key={network.name}
              >
                {network.name}
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}