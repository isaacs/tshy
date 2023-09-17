import { foo } from '#foo'
export const test = async () => {
  await import('@my/package/foo').then(({ foo }) =>
    console.log('pkg exports', foo)
  )
  console.log(foo)
}
