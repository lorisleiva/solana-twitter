import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaTwitter } from '../target/types/solana_twitter';
import * as assert from "assert";
import * as bs58 from "bs58";

describe('solana-twitter', () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());
    const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;
    const sendTweet = async (author, topic, content) => {
        const tweet = anchor.web3.Keypair.generate();
        await program.rpc.sendTweet(topic, content, {
            accounts: {
                tweet: tweet.publicKey,
                author,
                systemProgram: anchor.web3.SystemProgram.programId,
            },
            signers: [tweet],
        });

        return tweet
    }

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

    it('cannot provide a topic with more than 50 characters', async () => {
        try {
            const tweet = anchor.web3.Keypair.generate();
            const topicWith51Chars = 'x'.repeat(51);
            await program.rpc.sendTweet(topicWith51Chars, 'Hummus, am I right?', {
                accounts: {
                    tweet: tweet.publicKey,
                    author: program.provider.wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
                signers: [tweet],
            });
        } catch (error) {
            assert.equal(error.msg, 'The provided topic should be 50 characters long maximum.');
            return;
        }

        assert.fail('The instruction should have failed with a 51-character topic.');
    });

    it('cannot provide a content with more than 280 characters', async () => {
        try {
            const tweet = anchor.web3.Keypair.generate();
            const contentWith281Chars = 'x'.repeat(281);
            await program.rpc.sendTweet('veganism', contentWith281Chars, {
                accounts: {
                    tweet: tweet.publicKey,
                    author: program.provider.wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                },
                signers: [tweet],
            });
        } catch (error) {
            assert.equal(error.msg, 'The provided content should be 280 characters long maximum.');
            return;
        }

        assert.fail('The instruction should have failed with a 281-character content.');
    });

    it('can fetch all tweets', async () => {
        const tweetAccounts = await program.account.tweet.all();
        assert.equal(tweetAccounts.length, 3);
    });

    it('can filter tweets by author', async () => {
        const authorPublicKey = program.provider.wallet.publicKey
        const tweetAccounts = await program.account.tweet.all([
            {
                memcmp: {
                    offset: 8, // Discriminator.
                    bytes: authorPublicKey.toBase58(),
                }
            }
        ]);

        assert.equal(tweetAccounts.length, 2);
        assert.ok(tweetAccounts.every(tweetAccount => {
            return tweetAccount.account.author.toBase58() === authorPublicKey.toBase58()
        }))
    });

    it('can filter tweets by topics', async () => {
        const tweetAccounts = await program.account.tweet.all([
            {
                memcmp: {
                    offset: 8 + // Discriminator.
                        32 + // Author public key.
                        8 + // Timestamp.
                        4, // Topic string prefix.
                    bytes: bs58.encode(Buffer.from('veganism')),
                }
            }
        ]);

        assert.equal(tweetAccounts.length, 2);
        assert.ok(tweetAccounts.every(tweetAccount => {
            return tweetAccount.account.topic === 'veganism'
        }))
    });

    it('can update a tweet', async () => {
        // Send a tweet and fetch its account.
        const author = program.provider.wallet.publicKey;
        const tweet = await sendTweet(author, 'web2', 'Hello World!');
        const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);

        // Ensure it has the right data.
        assert.equal(tweetAccount.topic, 'web2');
        assert.equal(tweetAccount.content, 'Hello World!');

        // Update the Tweet.
        await program.rpc.updateTweet('solana', 'gm everyone!', {
            accounts: {
                tweet: tweet.publicKey,
                author,
            },
        });

        // Ensure the updated tweet has the updated data.
        const updatedTweetAccount = await program.account.tweet.fetch(tweet.publicKey);
        assert.equal(updatedTweetAccount.topic, 'solana');
        assert.equal(updatedTweetAccount.content, 'gm everyone!');
    });

    it('cannot update someone else\'s tweet', async () => {
        // Send a tweet.
        const author = program.provider.wallet.publicKey;
        const tweet = await sendTweet(author, 'solana', 'Solana is awesome!');

        // Update the Tweet.
        try {
            await program.rpc.updateTweet('eth', 'Ethereum is awesome!', {
                accounts: {
                    tweet: tweet.publicKey,
                    author: anchor.web3.Keypair.generate().publicKey,
                },
            });
            assert.fail('We were able to update someone else\'s tweet.');
        } catch (error) {
            // Ensure the tweet account kept the initial data.
            const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
            assert.equal(tweetAccount.topic, 'solana');
            assert.equal(tweetAccount.content, 'Solana is awesome!');
        }
    });

    it('can delete a tweet', async () => {
        // Create a new tweet.
        const author = program.provider.wallet.publicKey;
        const tweet = await sendTweet(author, 'solana', 'gm');

        // Delete the Tweet.
        await program.rpc.deleteTweet({
            accounts: {
                tweet: tweet.publicKey,
                author,
            },
        });

        // Ensure fetching the tweet account returns null.
        const tweetAccount = await program.account.tweet.fetchNullable(tweet.publicKey);
        assert.ok(tweetAccount === null);
    });

    it('cannot delete someone else\'s tweet', async () => {
        // Create a new tweet.
        const author = program.provider.wallet.publicKey;
        const tweet = await sendTweet(author, 'solana', 'gm');

        // Try to delete the Tweet from a different author.
        try {
            await program.rpc.deleteTweet({
                accounts: {
                    tweet: tweet.publicKey,
                    author: anchor.web3.Keypair.generate().publicKey,
                },
            });
            assert.fail('We were able to delete someone else\'s tweet.');
        } catch (error) {
            // Ensure the tweet account still exists with the right data.
            const tweetAccount = await program.account.tweet.fetch(tweet.publicKey);
            assert.equal(tweetAccount.topic, 'solana');
            assert.equal(tweetAccount.content, 'gm');
        }
    });
});
