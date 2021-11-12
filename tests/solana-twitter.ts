import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaTwitter } from '../target/types/solana_twitter';
import * as assert from "assert";

describe('solana-twitter', () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());
    const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;

    // Send a tweet helper.
    async function sendTweet(topic: string, content: string) {
        const tweet = anchor.web3.Keypair.generate();
        const transaction = await program.rpc.sendTweet(topic, content, {
            accounts: {
                tweet: tweet.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [tweet],
        });

        return { tweet, transaction };
    }

    it('can send a new tweet', async () => {
        // Execute the "SendTweet" instruction.
        const { tweet } = await sendTweet('veganism', 'Hummus, am I right?');

        // Fetch the account details of the created tweet.
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'veganism');
        assert.equal(tweetAccount.content, 'Hummus, am I right?');
    });

    it('can send a new tweet without a topic', async () => {
        // Execute the "SendTweet" instruction.
        const { tweet } = await sendTweet('', 'gm');
        anchor.setProvider(anchor.Provider.env());

        // Fetch the account details of the created tweet.
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, '');
        assert.equal(tweetAccount.content, 'gm');
    });

    it('can send a new tweet from a different author', async () => {
        // // Switch to the other user.
        // // TODO
        //
        // // Execute the "SendTweet" instruction.
        // const { tweet } = await sendTweet('veganism', 'Yay Tofu!');
        //
        // // Fetch the account details of the created tweet.
        // const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
        //
        // // Ensure it has the right data.
        // assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        // assert.equal(tweetAccount.topic, 'veganism');
        // assert.equal(tweetAccount.content, 'Yay Tofu!');
    });

    it('can send a new tweet again', async () => {
        // Execute the "SendTweet" instruction.
        const { tweet } = await sendTweet('veganism', 'Hummus, am I right?');

        // Fetch the account details of the created tweet.
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'veganism');
        assert.equal(tweetAccount.content, 'Hummus, am I right?');
    });

    it('can fetch all tweets', async () => {
        const tweetAccounts = await program.account.tweet.all();
        assert.equal(tweetAccounts.length, 3);
    });

    it('can filter tweets by topics', async () => {
        const tweetAccounts = await program.account.tweet.all([
            {
                memcmp: {
                    offset: 1,
                    bytes: 'Foo',
                }
            }
        ]);
    });
});
