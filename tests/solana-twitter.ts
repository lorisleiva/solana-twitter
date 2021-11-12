import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaTwitter } from '../target/types/solana_twitter';
import * as assert from "assert";

describe('solana-twitter', () => {
    // Configure the client to use the local cluster.
    const envProvider = anchor.Provider.env();
    const otherUserWallet = new anchor.Wallet(anchor.web3.Keypair.generate());
    const otherUserProvider = new anchor.Provider(envProvider.connection, otherUserWallet, envProvider.opts)

    anchor.setProvider(envProvider);
    const aliceProgram = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;
    anchor.setProvider(otherUserProvider);
    const programOtherUser = new Program<SolanaTwitter>(aliceProgram.idl, aliceProgram.programId, otherUserProvider);

    // Send a tweet helper.
    async function sendTweet(topic: string, content: string, program: Program<SolanaTwitter> = null) {
        program = program ?? aliceProgram;
        const keypair = anchor.web3.Keypair.generate();
        const transaction = await program.rpc.sendTweet(topic, content, {
            accounts: {
                tweet: keypair.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [keypair],
        });

        return { keypair, transaction };
    }

    it('can send a new tweet', async () => {
        // Execute the "SendTweet" instruction.
        const { keypair } = await sendTweet('veganism', 'Hummus, am I right?');

        // Fetch the account details of the created tweet.
        const tweetAccount = await aliceProgram.account.tweet.fetch(keypair.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), aliceProgram.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'veganism');
        assert.equal(tweetAccount.content, 'Hummus, am I right?');
    });

    it('can send a new tweet without a topic', async () => {
        // Execute the "SendTweet" instruction.
        const { keypair } = await sendTweet('', 'gm');
        anchor.setProvider(anchor.Provider.env());

        // Fetch the account details of the created tweet.
        const tweetAccount = await aliceProgram.account.tweet.fetch(keypair.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), aliceProgram.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, '');
        assert.equal(tweetAccount.content, 'gm');
    });

    it('can send a new tweet from a different author', async () => {
        // Switch to the other user.
        anchor.setProvider(otherUserProvider);

        // Execute the "SendTweet" instruction.
        const { keypair } = await sendTweet('veganism', 'Yay Tofu!', programOtherUser);

        // Fetch the account details of the created tweet.
        const tweetAccount = await programOtherUser.account.tweet.fetch(keypair.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), otherUserProvider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'veganism');
        assert.equal(tweetAccount.content, 'Yay Tofu!');
    });

    it('can send a new tweet again', async () => {
        // Execute the "SendTweet" instruction.
        const { keypair } = await sendTweet('veganism', 'Hummus, am I right?');

        // Fetch the account details of the created tweet.
        const tweetAccount = await aliceProgram.account.tweet.fetch(keypair.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), envProvider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'veganism');
        assert.equal(tweetAccount.content, 'Hummus, am I right?');
    });

    it('can fetch all tweets', async () => {
        const tweetAccounts = await aliceProgram.account.tweet.all();
        assert.equal(tweetAccounts.length, 4);
    });

    it('can filter tweets by topics', async () => {
        const tweetAccounts = await aliceProgram.account.tweet.all([
            {
                memcmp: {
                    offset: 1,
                    bytes: 'Foo',
                }
            }
        ]);
    });
});
