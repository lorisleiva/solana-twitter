<script setup>
import { ref } from 'vue'
import { fetchTweets } from '@/api'
import TweetCard from '@/components/TweetCard'
import TweetForm from '@/components/TweetForm'

const tweets = ref([])
const loading = ref(true)
fetchTweets()
    .then(fetchedTweets => tweets.value = fetchedTweets)
    .finally(() => loading.value = false)

const prependTweet = tweet => tweets.value.unshift(tweet)
</script>

<template>
    <div>
        <div class="border-b">
            <tweet-form @added="prependTweet"></tweet-form>
        </div>
        <div v-if="loading" class="p-8 text-gray-500 text-center">
            Loading...
        </div>
        <div v-else class="divide-y">
            <tweet-card v-for="tweet in tweets" :key="tweet.key" :tweet="tweet"></tweet-card>
        </div>
    </div>
</template>
