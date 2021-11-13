<script setup>
import { getPhantomWallet, getSolletWallet } from '@solana/wallet-adapter-wallets'
import { WalletProvider } from '@solana/wallet-adapter-vue'
import AppSidebar from './components/AppSidebar'

const wallets = [
    getPhantomWallet(),
    getSolletWallet(),
]
</script>

<template>
    <wallet-provider :wallets="wallets" auto-connect>
        <div class="w-full max-w-4xl mx-auto h-screen flex">

            <!-- Sidebar. -->
            <app-sidebar class="w-64 py-8 pr-8"></app-sidebar>

            <!-- Main -->
            <main class="flex-1 border-r border-l">
                <header class="flex space-x-6 items-center justify-between px-8 py-4 border-b">
                    <div class="text-xl font-bold">Home</div>
                </header>
                <div class="p-8 border-b">
                    Tweet form here...
                </div>
                <div class="p-8">
                    Tweets here...
                </div>
            </main>
        </div>
    </wallet-provider>
</template>
