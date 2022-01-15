export const updateTweet = async ({ wallet, program }, tweet, topic, content) => {
    await program.value.rpc.updateTweet(topic, content, {
        accounts: {
            author: wallet.value.publicKey,
            tweet: tweet.publicKey,
        },
    })

    tweet.topic = topic
    tweet.content = content
}
