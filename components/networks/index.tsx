import React, { SFC, useState } from 'react'
import { INetworks, KNetwork, IWeb3s } from '../../types'
import scss from './styles.scss'

interface IProps {
  web3s: IWeb3s
  networks: INetworks
  activeNetwork: KNetwork,
  changeNetwork: (network: KNetwork) => void
}

export const Networks: SFC<IProps> =
  ({ web3s, networks, activeNetwork, changeNetwork }) => {
    const [isOpen, toggleNetworks] = useState<boolean>(false)

    function chooseNetwork(network: KNetwork) {
      if (web3s[network] === null) return
      changeNetwork(network)
      toggleNetworks(isOpen => !isOpen)
    }

    return (
      <div className={`${scss.container} ${isOpen ? '' : scss.closed}`}>
        <button
          className={scss['active-network']}
          onClick={() => toggleNetworks(isOpen => !isOpen)}
        >
          {networks[activeNetwork].name}
          <span className={`${scss['up-icon']} mdi mdi-chevron-up`} />
        </button>
        <ul className={scss.networks}>
          {
            Object.entries<INetworks, KNetwork>(networks)
              .map(network =>
                <li
                  className={`${scss.network}
                    ${activeNetwork === network[0] ? scss.active : ''}
                    ${web3s[network[0]] === null ? scss.off : scss.on}`}
                  onClick={chooseNetwork.bind(null, network[0])}
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