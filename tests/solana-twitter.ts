import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaTwitter } from '../target/types/solana_twitter';

describe('solana-twitter', () => {
    // Configure the client to use the local cluster.
    anchor.setProvider(anchor.Provider.env());

    const program = anchor.workspace.SolanaTwitter as Program<SolanaTwitter>;

    it('can send new tweets', async () => {
        const tweetKeypair = anchor.web3.Keypair.generate();

        // Add your test here.
        const topic = 'veganism';
        const content = 'Hummus, am I right?';
        const tx = await program.rpc.sendTweet(topic, content, {
            accounts: {
                tweet: tweetKeypair.publicKey,
                author: anchor.getProvider().wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            },
            signers: [tweetKeypair],
        });
        console.log("Your transaction signature", tx);
    });
});
