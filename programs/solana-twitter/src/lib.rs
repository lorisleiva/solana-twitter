use anchor_lang::prelude::*;

declare_id!("AyCdgphakGxHDBgqEPNw2wf7NjHhfVwfAjfpmu5vfc4Q");

#[program]
pub mod solana_twitter {
    use super::*;
    pub fn send_tweet(ctx: Context<SendTweet>, topic: String, content: String) -> ProgramResult {
        let tweet: &mut Account<Tweet> = &mut ctx.accounts.tweet;
        let author: &Signer = &ctx.accounts.author;
        tweet.author = *author.key;
        tweet.topic = topic.to_string();
        tweet.content = content.to_string();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendTweet<'info> {
    #[account(init, payer = author, space = Tweet.LEN)]
    pub tweet: Account<'info, BaseAccount>,
    #[account(mut)]
    pub author: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: AccountInfo<'info>,
    pub rent: Sysvar<'info, Rent>,
}

#[account]
pub struct Tweet {
    pub author: Pubkey,
    pub topic: String,
    pub content: String,
}

impl Tweet {
    const LEN: usize = 8 // Discriminator.
        + 32 // Author (Pubkey).
        + 50 * 4 // Topic (String of 50 chars max).
        + 280 * 4; // Content (Strong of 280 chars max).
}
