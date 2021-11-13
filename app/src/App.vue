<script setup>
import { getPhantomWallet, getSolletWallet } from '@solana/wallet-adapter-wallets'
import { WalletProvider } from '@solana/wallet-adapter-vue'
import { WalletMultiButton, WalletModalProvider } from '@solana/wallet-adapter-vue-ui'

const wallets = [
    getPhantomWallet(),
    getSolletWallet(),
]
</script>

<template>
    <wallet-provider :wallets="wallets" auto-connect>
        <div>
            <div class="fixed top-0 right-0 p-8">
                <wallet-modal-provider>
                    <wallet-multi-button></wallet-multi-button>
                </wallet-modal-provider>
            </div>
            <div>TODO</div>
        </div>
    </wallet-provider>
</template>
