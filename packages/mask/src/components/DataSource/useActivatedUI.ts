import { useEffect } from 'react'
import { useAsync, useAsyncRetry } from 'react-use'
import { first, isEqual } from 'lodash-es'
import { Subscription, useSubscription } from 'use-subscription'
import { ValueRef } from '@dimensiondev/holoflows-kit'
import { useValueRef } from '@masknet/shared-base-ui'
import type { IdentityResolved } from '@masknet/plugin-infra'
import { NextIDProof } from '@masknet/web3-providers'
import type { ProfileInformation } from '@masknet/shared-base'
import type { SocialIdentity } from '@masknet/web3-shared-base'
import { activatedSocialNetworkUI, globalUIState } from '../../social-network/index.js'
import Services from '../../extension/service.js'
import { MaskMessages } from '../../utils/index.js'

async function queryPersonaFromDB(identityResolved: IdentityResolved) {
    if (!identityResolved.identifier) return
    return Services.Identity.queryPersonaByProfile(identityResolved.identifier)
}

async function queryPersonasFromNextID(identityResolved: IdentityResolved) {
    if (!identityResolved.identifier) return
    if (!activatedSocialNetworkUI.configuration.nextIDConfig?.platform) return
    return NextIDProof.queryAllExistedBindingsByPlatform(
        activatedSocialNetworkUI.configuration.nextIDConfig?.platform,
        identityResolved.identifier.userId,
    )
}

const defaults = new ValueRef<IdentityResolved>({}, isEqual)

const CurrentIdentitySubscription: Subscription<ProfileInformation | undefined> = {
    getCurrentValue() {
        const all = globalUIState.profiles.value
        const current = (activatedSocialNetworkUI.collecting.identityProvider?.recognized || defaults).value.identifier
        return all.find((i) => i.identifier === current) || first(all)
    },
    subscribe(sub) {
        const a = globalUIState.profiles.addListener(sub)
        const b = activatedSocialNetworkUI.collecting.identityProvider?.recognized.addListener(sub)
        return () => [a(), b?.()]
    },
}

export function useCurrentIdentity() {
    return useSubscription(CurrentIdentitySubscription)
}

export function useLastRecognizedIdentity() {
    return useValueRef(activatedSocialNetworkUI.collecting.identityProvider?.recognized || defaults)
}

export function useCurrentVisitingIdentity() {
    return useValueRef(activatedSocialNetworkUI.collecting.currentVisitingIdentityProvider?.recognized || defaults)
}

export function useCurrentLinkedPersona() {
    const currentIdentity = useSubscription(CurrentIdentitySubscription)
    return useAsync(async () => {
        if (!currentIdentity?.linkedPersona) return
        return Services.Identity.queryPersona(currentIdentity.linkedPersona)
    }, [currentIdentity?.linkedPersona])
}

/**
 * Get the social identity of the given identity
 */
export function useSocialIdentity(identity: IdentityResolved | null | undefined) {
    const result = useAsyncRetry<SocialIdentity | undefined>(async () => {
        if (!identity) return
        const bindings = await queryPersonasFromNextID(identity)
        const persona = await queryPersonaFromDB(identity)
        const personaBindings =
            bindings?.filter((x) => x.persona === persona?.identifier.publicKeyAsHex.toLowerCase()) ?? []
        return {
            ...identity,
            publicKey: persona?.identifier.publicKeyAsHex,
            hasBinding: personaBindings.length > 0,
            binding: first(personaBindings),
        }
    }, [identity])

    useEffect(() => MaskMessages.events.ownProofChanged.on(result.retry), [result.retry])

    return result
}

export function useSocialIdentityByUseId(userId?: string) {
    const { value: identity } = useAsync(async () => {
        if (!userId) return
        return activatedSocialNetworkUI.utils.getUserIdentity?.(userId)
    }, [userId])
    return useSocialIdentity(identity)
}

/**
 * Get the social identity of the last recognized identity
 */
export function useLastRecognizedSocialIdentity() {
    const identity = useLastRecognizedIdentity()
    return useSocialIdentity(identity)
}

/**
 * Get the social identity of the current visiting identity
 */
export function useCurrentVisitingSocialIdentity() {
    const identity = useCurrentVisitingIdentity()
    return useSocialIdentity(identity)
}
