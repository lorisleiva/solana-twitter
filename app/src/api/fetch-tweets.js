import { useWorkspace } from '@/composables'
import { Tweet } from '@/models'

export const fetchTweets = async () => {
    const { program } = useWorkspace()
    const tweets = await program.value.account.tweet.all();
    return tweets.map(tweet => new Tweet(tweet.publicKey, tweet.account))
}
