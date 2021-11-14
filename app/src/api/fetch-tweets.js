import bs58 from 'bs58'
import { Tweet } from '@/models';
import { useWorkspace } from "@/composables"

export const fetchTweets = async (filters = []) => {
    const { program } = useWorkspace()

    const tweets = await program.value.account.tweet.all(filters);
    return tweets.map(tweet => new Tweet(tweet.publicKey, tweet.account))
}

export const authorFilter = author => ({
    memcmp: {
        offset: 8, // Discriminator.
        bytes: bs58.encode(Buffer.from(author)),
    }
})

export const topicFilter = topic => ({
    memcmp: {
        offset: 8 + // Discriminator.
            32 + // Author public key.
            4, // Topic string length.
        bytes: bs58.encode(Buffer.from(topic)),
    }
})
