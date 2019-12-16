import React, { SFC, useState, useContext } from 'react'
import { NetworksInfo, NetworkType, Connections } from '../../types'
import scss from './styles.scss'
import { AppContext } from '../../types'
import NetworkIcon from '../../assets/images/network-icon.svg'
import NetworkIconError from '../../assets/images/network-icon-error.svg'

type Props = {
  connections: Connections
  networks: NetworksInfo
  activeNetwork: NetworkType
  changeNetwork: (network: NetworkType) => void
}

export const Networks: SFC<Props> =
  ({ connections, networks, activeNetwork, changeNetwork }) => {
    const { isTablet } = useContext(AppContext)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function toggleNetworks(): void {
      setIsOpen(isOpen => !isOpen)
    }

    function chooseNetwork(network: NetworkType): void {
      if (!connections[network]) return
      changeNetwork(network)
      toggleNetworks()
    }

    if (!isTablet) {
      return (
        <div className={`${scss.container} ${isOpen ? '' : scss.closed}`}>
          <button
            className={`${scss['active-network']} ${connections[activeNetwork] ? scss.on : scss.off}`}
            onClick={toggleNetworks}
          >
            {connections[activeNetwork] 
              ? networks[activeNetwork].name
              : 'Web3 is not initialized'
            }
            <span className={`${scss['up-icon']} mdi mdi-chevron-up`} />
          </button>
          <ul className={scss.networks}>
            {
              Object.entries<NetworksInfo, NetworkType>(networks)
                .map(([network, info]) =>
                  <li
                    className={`
                      ${scss.network}
                      ${activeNetwork === network ? scss.active : ''}
                      ${connections[network] ? scss.on : scss.off}
                    `}
                    onClick={chooseNetwork.bind(null, network)}
                    key={network}
                  >
                    {info.name}
                  </li>
                )
            }
          </ul>
        </div>
      )
    }

    return (
      <div className={`${scss.container} ${activeNetwork ? scss.good : scss.error}`}>
        
        {activeNetwork
          ? <NetworkIcon
              className={scss.icon}
              width={28}
              height={28}
              viewBox="0 0 28 28"
            />
          : <NetworkIconError
              className={scss.icon}
              width={20}
              height={20}
              viewBox="0 0 20 20"
            />
        }
        <select 
          className={scss.networksmobile}
          value={activeNetwork || ''}
          onChange={(e): void => chooseNetwork(e.target.value as NetworkType)}>
        {
              Object.entries<NetworksInfo, NetworkType>(networks)
                .map(([network,]) =>
                  <option
                    className={scss.network}
                    disabled={!connections[network]}
                    value={network}
                    key={network}
                  >
                    {connections[activeNetwork]
                      ? network.charAt(0).toUpperCase() + network.slice(1)
                      : 'None'
                    }
                  </option>
                )
            }
        </select>
      </div>
    )
  }