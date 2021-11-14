<script setup>
import { computed, ref } from 'vue'
import { fetchTweets } from '@/api'
import { useWallet } from '@solana/wallet-adapter-vue'
import TweetCard from '@/components/TweetCard'
import TweetForm from '@/components/TweetForm'

const tweets = ref([])
const orderedTweets = computed(() => {
    return tweets.value.slice().sort((a, b) => b.timestamp - a.timestamp)
})

const { connected } = useWallet()
const loading = ref(true)
fetchTweets()
    .then(fetchedTweets => tweets.value = fetchedTweets)
    .finally(() => loading.value = false)

const addTweet = tweet => tweets.value.push(tweet)
</script>

<template>
    <div>
        <div v-if="connected" class="border-b">
            <tweet-form @added="addTweet"></tweet-form>
        </div>
        <div v-else class="px-8 py-4 bg-gray-50 text-gray-500 text-center border-b">
            Connect your wallet to start tweeting...
        </div>
        <div v-if="loading" class="p-8 text-gray-500 text-center">
            Loading...
        </div>
        <div v-else class="divide-y">
            <tweet-card v-for="tweet in orderedTweets" :key="tweet.key" :tweet="tweet"></tweet-card>
        </div>
    </div>
</template>
