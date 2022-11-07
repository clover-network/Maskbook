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
} from './types.js'

interface EventOptions {
    filter?: object
    fromBlock?: BlockType
    topics?: string[]
}

export type AdminChanged = ContractEventLog<{
    previousAdmin: string
    newAdmin: string
    0: string
    1: string
}>
export type BeaconUpgraded = ContractEventLog<{
    beacon: string
    0: string
}>
export type EventActivateCampaign = ContractEventLog<{
    _cid: string
    0: string
}>
export type EventClaim = ContractEventLog<{
    _cid: string
    _dummyId: string
    _nftID: string
    _sender: string
    0: string
    1: string
    2: string
    3: string
}>
export type EventClaimBatch = ContractEventLog<{
    _cid: string
    _dummyIdArr: string[]
    _nftIDArr: string[]
    _sender: string
    0: string
    1: string[]
    2: string[]
    3: string
}>
export type EventForge = ContractEventLog<{
    _cid: string
    _dummyId: string
    _nftID: string
    _sender: string
    0: string
    1: string
    2: string
    3: string
}>
export type Paused = ContractEventLog<{
    account: string
    0: string
}>
export type Unpaused = ContractEventLog<{
    account: string
    0: string
}>
export type Upgraded = ContractEventLog<{
    implementation: string
    0: string
}>

export interface SpaceStationGalaxy extends BaseContract {
    constructor(jsonInterface: any[], address?: string, options?: ContractOptions): SpaceStationGalaxy
    clone(): SpaceStationGalaxy
    methods: {
        _hash(
            _cid: number | string | BN,
            _starNFT: string,
            _dummyId: number | string | BN,
            _powah: number | string | BN,
            _account: string,
        ): NonPayableTransactionObject<string>

        _hashBatch(
            _cid: number | string | BN,
            _starNFT: string,
            _dummyIdArr: (number | string | BN)[],
            _powahArr: (number | string | BN)[],
            _account: string,
        ): NonPayableTransactionObject<string>

        _hashForge(
            _cid: number | string | BN,
            _starNFT: string,
            _nftIDs: (number | string | BN)[],
            _dummyId: number | string | BN,
            _powah: number | string | BN,
            _account: string,
        ): NonPayableTransactionObject<string>

        _verify(hash: string | number[], signature: string | number[]): NonPayableTransactionObject<boolean>

        activateCampaign(
            _cid: number | string | BN,
            _platformFee: number | string | BN,
            _erc20Fee: number | string | BN,
            _erc20: string,
        ): NonPayableTransactionObject<void>

        campaignFeeConfigs(arg0: number | string | BN): NonPayableTransactionObject<{
            erc20: string
            erc20Fee: string
            platformFee: string
            0: string
            1: string
            2: string
        }>

        campaign_setter(): NonPayableTransactionObject<string>

        claim(
            _cid: number | string | BN,
            _starNFT: string,
            _dummyId: number | string | BN,
            _powah: number | string | BN,
            _signature: string | number[],
        ): PayableTransactionObject<void>

        claimBatch(
            _cid: number | string | BN,
            _starNFT: string,
            _dummyIdArr: (number | string | BN)[],
            _powahArr: (number | string | BN)[],
            _signature: string | number[],
        ): PayableTransactionObject<void>

        forge(
            _cid: number | string | BN,
            _starNFT: string,
            _nftIDs: (number | string | BN)[],
            _dummyId: number | string | BN,
            _powah: number | string | BN,
            _signature: string | number[],
        ): PayableTransactionObject<void>

        galaxy_signer(): NonPayableTransactionObject<string>

        hasMinted(arg0: number | string | BN): NonPayableTransactionObject<boolean>

        initialize(
            signer: string,
            setter: string,
            contract_manager: string,
            treasury: string,
        ): NonPayableTransactionObject<void>

        manager(): NonPayableTransactionObject<string>

        pause(): NonPayableTransactionObject<void>

        paused(): NonPayableTransactionObject<boolean>

        treasury_manager(): NonPayableTransactionObject<string>

        unpause(): NonPayableTransactionObject<void>

        updateCampaignSetter(newAddress: string): NonPayableTransactionObject<void>

        updateGalaxySigner(newAddress: string): NonPayableTransactionObject<void>

        updateManager(newAddress: string): NonPayableTransactionObject<void>

        updateTreasureManager(newAddress: string): NonPayableTransactionObject<void>

        upgradeTo(newImplementation: string): NonPayableTransactionObject<void>

        upgradeToAndCall(newImplementation: string, data: string | number[]): PayableTransactionObject<void>
    }
    events: {
        AdminChanged(cb?: Callback<AdminChanged>): EventEmitter
        AdminChanged(options?: EventOptions, cb?: Callback<AdminChanged>): EventEmitter

        BeaconUpgraded(cb?: Callback<BeaconUpgraded>): EventEmitter
        BeaconUpgraded(options?: EventOptions, cb?: Callback<BeaconUpgraded>): EventEmitter

        EventActivateCampaign(cb?: Callback<EventActivateCampaign>): EventEmitter
        EventActivateCampaign(options?: EventOptions, cb?: Callback<EventActivateCampaign>): EventEmitter

        EventClaim(cb?: Callback<EventClaim>): EventEmitter
        EventClaim(options?: EventOptions, cb?: Callback<EventClaim>): EventEmitter

        EventClaimBatch(cb?: Callback<EventClaimBatch>): EventEmitter
        EventClaimBatch(options?: EventOptions, cb?: Callback<EventClaimBatch>): EventEmitter

        EventForge(cb?: Callback<EventForge>): EventEmitter
        EventForge(options?: EventOptions, cb?: Callback<EventForge>): EventEmitter

        Paused(cb?: Callback<Paused>): EventEmitter
        Paused(options?: EventOptions, cb?: Callback<Paused>): EventEmitter

        Unpaused(cb?: Callback<Unpaused>): EventEmitter
        Unpaused(options?: EventOptions, cb?: Callback<Unpaused>): EventEmitter

        Upgraded(cb?: Callback<Upgraded>): EventEmitter
        Upgraded(options?: EventOptions, cb?: Callback<Upgraded>): EventEmitter

        allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter
    }

    once(event: 'AdminChanged', cb: Callback<AdminChanged>): void
    once(event: 'AdminChanged', options: EventOptions, cb: Callback<AdminChanged>): void

    once(event: 'BeaconUpgraded', cb: Callback<BeaconUpgraded>): void
    once(event: 'BeaconUpgraded', options: EventOptions, cb: Callback<BeaconUpgraded>): void

    once(event: 'EventActivateCampaign', cb: Callback<EventActivateCampaign>): void
    once(event: 'EventActivateCampaign', options: EventOptions, cb: Callback<EventActivateCampaign>): void

    once(event: 'EventClaim', cb: Callback<EventClaim>): void
    once(event: 'EventClaim', options: EventOptions, cb: Callback<EventClaim>): void

    once(event: 'EventClaimBatch', cb: Callback<EventClaimBatch>): void
    once(event: 'EventClaimBatch', options: EventOptions, cb: Callback<EventClaimBatch>): void

    once(event: 'EventForge', cb: Callback<EventForge>): void
    once(event: 'EventForge', options: EventOptions, cb: Callback<EventForge>): void

    once(event: 'Paused', cb: Callback<Paused>): void
    once(event: 'Paused', options: EventOptions, cb: Callback<Paused>): void

    once(event: 'Unpaused', cb: Callback<Unpaused>): void
    once(event: 'Unpaused', options: EventOptions, cb: Callback<Unpaused>): void

    once(event: 'Upgraded', cb: Callback<Upgraded>): void
    once(event: 'Upgraded', options: EventOptions, cb: Callback<Upgraded>): void
}
