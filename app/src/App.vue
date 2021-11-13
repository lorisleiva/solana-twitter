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
        <div class="w-full max-w-4xl mx-auto h-screen flex">

            <!-- Sidebar. -->
            <aside class="w-64">
                Sidebar
            </aside>

            <!-- Main -->
            <main class="flex-1 border-r border-l">
                <div class="flex space-x-6 items-center justify-between p-8">
                    <div>Home</div>
                    <wallet-modal-provider>
                        <wallet-multi-button></wallet-multi-button>
                    </wallet-modal-provider>
                </div>
                <div>
                    Content
                </div>
            </main>
        </div>
    </wallet-provider>
</template>
