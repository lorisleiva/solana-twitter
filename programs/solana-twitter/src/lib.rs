use anchor_lang::prelude::*;

declare_id!("AyCdgphakGxHDBgqEPNw2wf7NjHhfVwfAjfpmu5vfc4Q");

#[program]
pub mod solana_twitter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
