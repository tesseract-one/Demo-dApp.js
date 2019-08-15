import abi from '../../assets/crypto_kitties_abi.json'
import { AbiItem } from 'web3-utils'
import { 
  withWeb3Context,
  Web3ContextedComponentClass
} from '../../hocs'

type IState = {
  kitties: string
}

export const ShowKitties = withWeb3Context<{}>(
  class Component extends Web3ContextedComponentClass<{}, IState> {
    readonly kittiesApi = new URL('https://public.api.cryptokitties.co/v1/kitties')
    public state = {
      kitties: 'Few'
    }

    async show() {
      const { web3, accounts } = this.props.web3Ctx
      const ctyptoKittiesAddress = '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d'
      const cryptoKittiesABI = abi as AbiItem[]
      const contract = new web3.eth.Contract(cryptoKittiesABI, ctyptoKittiesAddress)
      const kittiesAsBigNumber = await contract.methods.balanceOf(accounts[0]).call()
      const kitties = kittiesAsBigNumber.toString()
      this.setState({ kitties })

      // const kittiesIds = await contract.methods.tokensOfOwner(accounts[0]).call()
      // tokensOfOwner was not implemented efficiently because doing so would require a lot of (expensive) storage
      // in the blockchain. Instead, we just loop over all the cats and see if their owner matches the function argument.
      // Sadly, geth apparently just kills a function if it takes too long and returns an empty response.
      // (The function was never intended to be called on-chain.)

      // console.log(await this.getKittiesFromApi(accounts[0]))

      //'https://storage.googleapis.com/ck-kitty-image/0x06012c8cf97bead5deae237070f9587f8e7a266d/'
    }

    async getKittiesFromApi(address: string): Promise<string[]> {
      const reqOptions: RequestInit = {
        method: 'get',
        headers: {
          'x-api-token': 'ABC'
        },

      }
      const reqParams = { 'owner_wallet_address': address }
      Object.keys(reqParams).forEach(key => this.kittiesApi.searchParams.append(key, reqParams[key]))
      const res = await fetch(this.kittiesApi.toString(), reqOptions)

      if (res.status !== 200) throw new Error(`Get error from CryptoKitties api. Status: ${res.status}`)

      const resJson = await res.json()
      console.log(res, resJson)
      return resJson
    }

    render() {
      return (
        <>
          <button onClick={ this.show.bind(this) }>Show kitties</button>
          <p>Your balance: { this.state.kitties } Kitties</p>
        </>
      )
    }
  }
)