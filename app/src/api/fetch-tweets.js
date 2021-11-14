import bs58 from 'bs58'
import { useWorkspace } from "../useWorkspace"

export default async (filters = []) => {
    const { program } = useWorkspace()

    return await program.account.tweet.all(filters);
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
