import { Tweet } from '@/models';
import { useWorkspace } from "@/composables"

export const getTweet = async (publicKey) => {
    const { program } = useWorkspace()
    const account = await program.value.account.tweet.fetch(publicKey);
    return new Tweet(publicKey, account)
}
