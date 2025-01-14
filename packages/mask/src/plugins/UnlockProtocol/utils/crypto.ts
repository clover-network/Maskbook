import { decodeArrayBuffer, decodeText, encodeArrayBuffer, encodeText } from '@masknet/kit'

export async function encryptUnlockData(content: string): Promise<{
    iv: string
    key: string
    encrypted: string
}> {
    const iv: ArrayBuffer = crypto.getRandomValues(new Uint8Array(16))
    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt'])
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        key,
        typeof content === 'string' ? encodeText(content) : content,
    )
    const exportKey = await crypto.subtle.exportKey('raw', key)

    return {
        iv: encodeArrayBuffer(new Uint8Array(iv)),
        key: encodeArrayBuffer(new Uint8Array(exportKey)),
        encrypted: encodeArrayBuffer(encrypted),
    }
}

export async function decryptUnlockData(
    iv: string,
    key: string,
    encrypted: string,
): Promise<{
    content: string
}> {
    const importKey = await crypto.subtle.importKey('raw', decodeArrayBuffer(key), 'AES-GCM', true, ['decrypt'])
    const decrypted = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: decodeArrayBuffer(iv),
        },
        importKey,
        decodeArrayBuffer(encrypted),
    )
    return { content: decodeText(decrypted) }
}
