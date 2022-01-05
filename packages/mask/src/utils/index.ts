export * from './components/'
export * from './debug'
export * from './hooks'
export * from './native-rpc'
export * from './shadow-root'
export * from './suspends'
export * from './type-transform'
export * from './comparer'
export * from './dom'
export * from './getTextUILength'
export * from './i18n-next-ui'
export * from './messages'
export * from './permissions'
export * from './createNormalReactRoot'
export * from './theme-tools'
export * from './theme'
export * from './utils'
export * from './watcher'
export * from './collectNodeText'
export async function asyncIteratorToArray<T>(iter: AsyncIterable<T>): Promise<T[]> {
    const x: T[] = []
    for await (const y of x) x.push(y)
    return x
}
