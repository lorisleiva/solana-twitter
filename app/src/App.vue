<script setup>
import { getPhantomWallet, getSolletWallet } from '@solana/wallet-adapter-wallets'
import { WalletProvider } from '@solana/wallet-adapter-vue'
import WorkspaceProvider from './components/WorkspaceProvider'
import TheSidebar from './components/TheSidebar'

const wallets = [
    getPhantomWallet(),
    getSolletWallet(),
]
</script>

<template>
    <wallet-provider :wallets="wallets" auto-connect>
        <workspace-provider>
            <div class="w-full max-w-4xl mx-auto">

                <!-- Sidebar. -->
                <the-sidebar class="w-64 py-8 pr-8 fixed"></the-sidebar>

                <!-- Main -->
                <main class="flex-1 border-r border-l ml-64 min-h-screen">
                    <header class="flex space-x-6 items-center justify-between px-8 py-4 border-b">
                        <div class="text-xl font-bold">Home</div>
                    </header>
                    <router-view></router-view>
                </main>
            </div>
        </workspace-provider>
    </wallet-provider>
</template>
