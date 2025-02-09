import { isZeroAddress, useGoodGhostingConstants, ZERO_ADDRESS } from '@masknet/web3-shared-evm'
import { useMemo } from 'react'
import { useAsyncRetry } from 'react-use'
import type { AsyncStateRetry } from 'react-use/lib/useAsyncRetry.js'
import { useGoodGhostingContract } from '../contracts/useGoodGhostingContract.js'
import type { GameMetaData, GoodGhostingInfo, Player, TimelineEvent } from '../types.js'
import { useI18N } from '../../../utils/index.js'
import addSeconds from 'date-fns/addSeconds'
import Services from '../../../extension/service.js'
import { useChainContext } from '@masknet/web3-hooks-base'
import { useSingleContractMultipleData } from '@masknet/web3-hooks-evm'
import type { NetworkPluginID } from '@masknet/shared-base'

export function useGameContractAddress(id: string) {
    const { GOOD_GHOSTING_CONTRACT_ADDRESS_FILE } = useGoodGhostingConstants()

    const asyncResult = useAsyncRetry(async (): Promise<GameMetaData> => {
        if (!GOOD_GHOSTING_CONTRACT_ADDRESS_FILE)
            return {
                contractAddress: '',
            }

        const gameData: any = await Services.Helper.fetchJSON(GOOD_GHOSTING_CONTRACT_ADDRESS_FILE)
        return gameData?.[id] || gameData?.default || {}
    }, [id, GOOD_GHOSTING_CONTRACT_ADDRESS_FILE])

    return asyncResult
}

export function useGameInfo(gameData: GameMetaData) {
    const { account, chainId } = useChainContext<NetworkPluginID.PLUGIN_EVM>()
    const contract = useGoodGhostingContract(chainId, gameData.contractAddress)
    const { names, callDatas } = useMemo(() => {
        const names = [
            'segmentPayment',
            'firstSegmentStart',
            'getCurrentSegment',
            'lastSegment',
            'segmentLength',
            'getNumberOfPlayers',
            'maxPlayersCount',
            'totalGameInterest',
            'totalGamePrincipal',
            'adaiToken',
            'lendingPool',
            'earlyWithdrawalFee',
            'rewardsPerPlayer',
        ] as any
        return {
            names: [...names, 'players'],
            callDatas: [...Array(names.length).fill([]), [account || ZERO_ADDRESS]],
        }
    }, [account])

    const [results, calls, _, callback] = useSingleContractMultipleData(contract, names, callDatas)
    const asyncResult = useAsyncRetry(() => callback(calls), [calls])

    const gameInfo = useMemo(() => {
        if (!contract || !results.length) return

        let failedToGetInfo = false
        const [
            segmentPayment,
            firstSegmentStart,
            currentSegment,
            lastSegment,
            segmentLength,
            numberOfPlayers,
            maxPlayersCount,
            totalGameInterest,
            totalGamePrincipal,
            adaiToken,
            lendingPool,
            earlyWithdrawalFee,
            rewardsPerPlayer,
            currentPlayer,
        ] = results.map((x) => {
            if (x.error) failedToGetInfo = true
            return x.error ? '' : (x.value as string)
        })

        if (failedToGetInfo) return

        const player = currentPlayer as any as Player

        return {
            ...gameData,
            segmentPayment,
            rewardsPerPlayer,
            firstSegmentStart: Number.parseInt(firstSegmentStart, 10),
            currentSegment: Number.parseInt(currentSegment, 10),
            lastSegment: Number.parseInt(lastSegment, 10),
            segmentLength: Number.parseInt(segmentLength, 10),
            numberOfPlayers: Number.parseInt(numberOfPlayers, 10),
            maxPlayersCount: Number.parseInt(maxPlayersCount, 10),
            totalGameInterest,
            totalGamePrincipal,
            adaiTokenAddress: adaiToken,
            lendingPoolAddress: lendingPool,
            earlyWithdrawalFee,
            currentPlayer: !isZeroAddress(player?.addr) ? player : undefined,
            gameHasEnded: Number.parseInt(currentSegment, 10) > Number.parseInt(lastSegment, 10),
            refresh: asyncResult.retry,
        } as GoodGhostingInfo
    }, [results, contract])

    return {
        ...asyncResult,
        value: gameInfo,
    } as AsyncStateRetry<typeof gameInfo>
}

export function useTimeline(info: GoodGhostingInfo) {
    const { t } = useI18N()

    const getTimelineEvent = (index: number, numberOfRounds: number) => {
        if (index === 0) {
            return {
                eventOnDate: t('plugin_good_ghosting_game_launched'),
                ongoingEvent: t('plugin_good_ghosting_join_round'),
            }
        } else if (index === 1) {
            return {
                eventOnDate: t('plugin_good_ghosting_join_deadline'),
                ongoingEvent: t('plugin_good_ghosting_deposit', {
                    index: index + 1,
                }),
            }
        } else if (index === numberOfRounds - 1) {
            return {
                eventOnDate: t('plugin_good_ghosting_deposit_deadline', {
                    index,
                }),
                ongoingEvent: t('plugin_good_ghosting_waiting_round'),
            }
        } else if (index === numberOfRounds) {
            return {
                eventOnDate: t('plugin_good_ghosting_waiting_round_end'),
                ongoingEvent: t('plugin_good_ghosting_withdraw'),
            }
        } else {
            return {
                eventOnDate: t('plugin_good_ghosting_deposit_deadline', {
                    index,
                }),
                ongoingEvent: t('plugin_good_ghosting_deposit', {
                    index: index + 1,
                }),
            }
        }
    }

    const startTime = info.firstSegmentStart
    const roundDuration = info.segmentLength
    const numberOfRounds = info.lastSegment && info.lastSegment + 1

    const timeline: TimelineEvent[] = useMemo(() => {
        if (!startTime || !roundDuration || !numberOfRounds) return []
        const initialDate = new Date(startTime * 1000)
        const rounds: TimelineEvent[] = []
        for (let i = 0; i <= numberOfRounds; i += 1) {
            rounds.push({
                date: addSeconds(initialDate, roundDuration * i),
                ...getTimelineEvent(i, numberOfRounds),
            })
        }
        return rounds
    }, [startTime, roundDuration, numberOfRounds])

    return timeline
}
