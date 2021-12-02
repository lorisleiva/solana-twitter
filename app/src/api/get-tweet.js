import { Tweet } from '@/models'

export const getTweet = async ({ program }, publicKey) => {
    const account = await program.value.account.tweet.fetch(publicKey);
    return new Tweet(publicKey, account)
}
