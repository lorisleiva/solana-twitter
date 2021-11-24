import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaTwitter } from '../target/types/solana_twitter';
import * as assert from "assert";

describe('solana-twitter', () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());
    const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;

    it('can send a new tweet', async () => {
        // Call the "SendTweet" instruction.
        const tweet = anchor.web3.Keypair.generate();
        await program.rpc.sendTweet('veganism', 'Hummus, am I right?', {
            accounts: {
                tweet: tweet.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [tweet],
        });

        // Fetch the account details of the created tweet.
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'veganism');
        assert.equal(tweetAccount.content, 'Hummus, am I right?');
        assert.ok(tweetAccount.timestamp);
    });

    it('can send a new tweet without a topic', async () => {
        // Call the "SendTweet" instruction.
        const tweet = anchor.web3.Keypair.generate();
        await program.rpc.sendTweet('', 'gm', {
            accounts: {
                tweet: tweet.publicKey,
                author: program.provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [tweet],
        });

        // Fetch the account details of the created tweet.
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), program.provider.wallet.publicKey.toBase58());
        assert.equal(tweetAccount.topic, '');
        assert.equal(tweetAccount.content, 'gm');
        assert.ok(tweetAccount.timestamp);
    });

    it('can send a new tweet from a different author', async () => {
        // Generate another user and airdrop them some SOL.
        const otherUser = anchor.web3.Keypair.generate();
        const signature = await program.provider.connection.requestAirdrop(otherUser.publicKey, 1000000000);
        await program.provider.connection.confirmTransaction(signature);

        // Call the "SendTweet" instruction on behalf of this other user.
        const tweet = anchor.web3.Keypair.generate();
        await program.rpc.sendTweet('veganism', 'Yay Tofu!', {
            accounts: {
                tweet: tweet.publicKey,
                author: otherUser.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [otherUser, tweet],
        });

        // Fetch the account details of the created tweet.
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.author.toBase58(), otherUser.publicKey.toBase58());
        assert.equal(tweetAccount.topic, 'veganism');
        assert.equal(tweetAccount.content, 'Yay Tofu!');
        assert.ok(tweetAccount.timestamp);
    });
});
