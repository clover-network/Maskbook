import type { FC } from 'react'
import { TipContext } from './TipContext'
import { TargetChainIdContext } from './TargetChainIdContext'

export const RootContext: FC = ({ children }) => {
    return (
        <TargetChainIdContext.Provider>
            <TipContext.Provider>{children}</TipContext.Provider>
        </TargetChainIdContext.Provider>
    )
}
