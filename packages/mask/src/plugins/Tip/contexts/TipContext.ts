import type { ERC721ContractDetailed } from '@masknet/web3-shared-evm'
import { useCallback, useEffect, useState } from 'react'
import { createContainer } from 'unstated-next'
import { TipType } from '../types'

const mockAddress = ['0x790116d0685eB197B886DAcAD9C247f785987A4a', '0x0111111111111111111111111111111111111111']

function useTip() {
    const [receiver, setReceiver] = useState('')
    const [receivers, setReceivers] = useState<string[]>(mockAddress)
    const [tipType, setTipType] = useState<TipType>(TipType.Token)
    const [amount, setAmount] = useState('0')
    const [erc721Contract, setErc721Contract] = useState<ERC721ContractDetailed>()

    const sendTip = useCallback(() => {
        console.log('TODO send tip')
    }, [])

    useEffect(() => {
        if (receiver || receivers.length === 0) return
        setReceiver(receivers[0])
    }, [receiver, receivers])

    return {
        tipType,
        setTipType,
        receiver,
        setReceiver,
        receivers,
        setReceivers,
        amount,
        setAmount,
        sendTip,
        erc721Contract,
        setErc721Contract,
    }
}

export const TipContext = createContainer(useTip)
