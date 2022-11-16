/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import BN from 'bn.js'
import { ContractOptions } from 'web3-eth-contract'
import { EventLog } from 'web3-core'
import { EventEmitter } from 'events'
import {
    Callback,
    PayableTransactionObject,
    NonPayableTransactionObject,
    BlockType,
    ContractEventLog,
    BaseContract,
} from './types'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type OwnershipTransferred = ContractEventLog<{
    previousOwner: string
    newOwner: string
    0: string
    1: string
}>
export type Paused = ContractEventLog<{
    account: string
    0: string
}>
export type Swapped = ContractEventLog<{
    sender: string
    srcToken: string
    dstToken: string
    dstReceiver: string
    amount: string
    spentAmount: string
    returnAmount: string
    minReturnAmount: string
    guaranteedAmount: string
    referrer: string
    0: string
    1: string
    2: string
    3: string
    4: string
    5: string
    6: string
    7: string
    8: string
    9: string
}>
export type Unpaused = ContractEventLog<{
    account: string
    0: string
}>

export interface OpenOceanExchangeV2 extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): OpenOceanExchangeV2
    clone(): OpenOceanExchangeV2
    methods: {
        initialize(): NonPayableTransactionObject<void>

        owner(): NonPayableTransactionObject<string>

        pause(): NonPayableTransactionObject<void>

        paused(): NonPayableTransactionObject<boolean>

        renounceOwnership(): NonPayableTransactionObject<void>

        rescueFunds(token: string, amount: number | string | BN): NonPayableTransactionObject<void>

        swap(
            caller: string,
            desc: [
                string,
                string,
                string,
                string,
                number | string | BN,
                number | string | BN,
                number | string | BN,
                number | string | BN,
                string,
                string | number[],
            ],
            calls: [number | string | BN, number | string | BN, number | string | BN, string | number[]][],
        ): PayableTransactionObject<string>

        transferOwnership(newOwner: string): NonPayableTransactionObject<void>
    }
    events: {
        OwnershipTransferred(cb?: Callback<OwnershipTransferred>): EventEmitter
        OwnershipTransferred(options?: EventOptions, cb?: Callback<OwnershipTransferred>): EventEmitter

        Paused(cb?: Callback<Paused>): EventEmitter
        Paused(options?: EventOptions, cb?: Callback<Paused>): EventEmitter

        Swapped(cb?: Callback<Swapped>): EventEmitter
        Swapped(options?: EventOptions, cb?: Callback<Swapped>): EventEmitter

        Unpaused(cb?: Callback<Unpaused>): EventEmitter
        Unpaused(options?: EventOptions, cb?: Callback<Unpaused>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'OwnershipTransferred', cb: Callback<OwnershipTransferred>): void
    once(event: 'OwnershipTransferred', options: EventOptions, cb: Callback<OwnershipTransferred>): void

    once(event: 'Paused', cb: Callback<Paused>): void
    once(event: 'Paused', options: EventOptions, cb: Callback<Paused>): void

    once(event: 'Swapped', cb: Callback<Swapped>): void
    once(event: 'Swapped', options: EventOptions, cb: Callback<Swapped>): void

    once(event: 'Unpaused', cb: Callback<Unpaused>): void
    once(event: 'Unpaused', options: EventOptions, cb: Callback<Unpaused>): void
}
