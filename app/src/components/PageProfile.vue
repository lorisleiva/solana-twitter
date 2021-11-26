<script setup>
import { ref, watchEffect } from 'vue'
import { fetchTweets } from '@/api'
import TweetForm from '@/components/TweetForm'
import TweetList from '@/components/TweetList'

const tweets = ref([])
const loading = ref(true)

watchEffect(() => {
    fetchTweets()
        .then(fetchedTweets => tweets.value = fetchedTweets)
        .finally(() => loading.value = false)
})

const addTweet = tweet => tweets.value.push(tweet)
</script>

<template>
    <!-- TODO: Check connected wallet -->
    <div v-if="true" class="border-b px-8 py-4 bg-gray-50">
        B1AfN7AgpMyctfFbjmvRAvE1yziZFDb9XCwydBjJwtRN
    </div>
    <tweet-form @added="addTweet"></tweet-form>
    <tweet-list :tweets="tweets" :loading="loading"></tweet-list>
</template>
