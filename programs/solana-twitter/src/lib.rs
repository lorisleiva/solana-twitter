use anchor_lang::prelude::*;

declare_id!("2BDbYV1ocs2S1PsYnd5c5mqtdLWGf5VbCYvf28rs9LGj");

#[program]
pub mod solana_twitter {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>) -> ProgramResult {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
