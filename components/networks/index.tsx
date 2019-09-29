import React, { SFC, useState, useContext } from 'react'
import { INetworks, KNetwork, IWeb3s } from '../../types'
import scss from './styles.scss'
import { Web3Context } from '../../pages'
import NetworkIcon from '../../assets/images/network-icon.svg'
import NetworkIconError from '../../assets/images/network-icon-error.svg'

interface IProps {
  web3s: IWeb3s
  networks: INetworks
  activeNetwork: KNetwork,
  changeNetwork: (network: KNetwork) => void
}

export const Networks: SFC<IProps> =
  ({ web3s, networks, activeNetwork, changeNetwork }) => {
    const { isMobile } = useContext(Web3Context)
    const [isOpen, toggleNetworks] = useState<boolean>(false)

    function chooseNetwork(network: KNetwork) {
      if (web3s[network] === null) return
      changeNetwork(network)
      toggleNetworks(isOpen => !isOpen)
    }

    if (!isMobile) {
      return (
        <div className={`${scss.container} ${isOpen ? '' : scss.closed}`}>
          <button
            className={`${scss['active-network']} ${networks[activeNetwork] ? scss.on : scss.off}`}
            onClick={() => toggleNetworks(isOpen => !isOpen)}
          >
            {networks[activeNetwork] 
              ? networks[activeNetwork].name
              : 'Web3 is not initialized'
            }
            <span className={`${scss['up-icon']} mdi mdi-chevron-up`} />
          </button>
          <ul className={scss.networks}>
            {
              Object.entries<INetworks, KNetwork>(networks)
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
      </div>
    )
  }