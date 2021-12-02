export const fetchTweets = async ({ program }) => {
    const tweets = await program.value.account.tweet.all();
    return tweets
}
