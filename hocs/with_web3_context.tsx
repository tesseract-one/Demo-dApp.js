import * as React from 'react'
import { Web3Context, Web3CtxConsumer } from "../pages"

type Context = { web3Ctx?: Web3Context | null }

export class Web3ContextedComponentClass<P, S> extends React.Component<P & Context, S> {}

export function withWeb3Context<P>(
    Component: React.ComponentType<P & Context>
  ): React.SFC<P> {
  return function BoundComponent(props: P) {
    return (
      <Web3CtxConsumer>
        {ctx => <Component {...props} web3Ctx={ctx} />}
      </Web3CtxConsumer>
    )
  }
}