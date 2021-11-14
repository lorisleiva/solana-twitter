<script setup>
import { computed, ref } from 'vue'
import { fetchTweets } from '@/api'
import TweetCard from '@/components/TweetCard'
import TweetForm from '@/components/TweetForm'

const tweets = ref([])
const orderedTweets = computed(() => {
    return tweets.value.slice().sort((a, b) => b.timestamp - a.timestamp)
})

const loading = ref(true)
fetchTweets()
    .then(fetchedTweets => tweets.value = fetchedTweets)
    .finally(() => loading.value = false)

const addTweet = tweet => tweets.value.push(tweet)
</script>

<template>
    <div>
        <tweet-form @added="addTweet"></tweet-form>
        <div v-if="loading" class="p-8 text-gray-500 text-center">
            Loading...
        </div>
        <div v-else class="divide-y">
            <tweet-card v-for="tweet in orderedTweets" :key="tweet.key" :tweet="tweet"></tweet-card>
        </div>
    </div>
</template>
