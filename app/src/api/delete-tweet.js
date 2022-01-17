export const deleteTweet = async ({ wallet, program }, tweet) => {
    await program.value.rpc.deleteTweet({
        accounts: {
            author: wallet.value.publicKey,
            tweet: tweet.publicKey,
        },
    })
}
