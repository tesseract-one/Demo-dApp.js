import React, { SFC, useState, useContext } from 'react'
import { Networks as NetworksType, KNetwork, Web3s } from '../../types'
import scss from './styles.scss'
import { Web3Context } from '../../pages'
import NetworkIcon from '../../assets/images/network-icon.svg'
import NetworkIconError from '../../assets/images/network-icon-error.svg'

interface IProps {
  web3s: Web3s
  networks: NetworksType
  activeNetwork: KNetwork
  changeNetwork: (network: KNetwork) => void
}

export const Networks: SFC<IProps> =
  ({ web3s, networks, activeNetwork, changeNetwork }) => {
    const { isTablet } = useContext(Web3Context)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    function toggleNetworks(): void {
      setIsOpen(isOpen => !isOpen)
    }

    function chooseNetwork(network: KNetwork): void {
      if (web3s[network] === null) return
      changeNetwork(network)
      toggleNetworks()
    }

    if (!isTablet) {
      return (
        <div className={`${scss.container} ${isOpen ? '' : scss.closed}`}>
          <button
            className={`${scss['active-network']} ${networks[activeNetwork] ? scss.on : scss.off}`}
            onClick={toggleNetworks}
          >
            {networks[activeNetwork] 
              ? networks[activeNetwork].name
              : 'Web3 is not initialized'
            }
            <span className={`${scss['up-icon']} mdi mdi-chevron-up`} />
          </button>
          <ul className={scss.networks}>
            {
              Object.entries<NetworksType, KNetwork>(networks)
                .map(network =>
                  <li
                    className={`${scss.network}
                      ${activeNetwork === network[0] ? scss.active : ''}
                      ${web3s
                        ? web3s[network[0]] === null
                          ? scss.off
                          : scss.on
                        : ''}`
                    }
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
          value={activeNetwork || Object.keys(networks)[0]}
          onChange={(e) => chooseNetwork(e.target.value as KNetwork)}>
        {
              Object.entries<NetworksType, KNetwork>(networks)
                .map(network =>
                  <option
                    className={scss.network}
                    disabled={!web3s || !web3s[network[0]]}
                    value={network[0]}
                    key={network[0]}
                  >
                    {networks[activeNetwork]
                      ? network[0].charAt(0).toUpperCase() + network[0].slice(1)
                      : 'None'
                    }
                  </option>
                )
            }
        </select>
      </div>
    )
  }