<script setup>
import { ref, watchEffect } from 'vue'
import { fetchTweets, authorFilter } from '@/api'
import { useWorkspace } from '@/composables'
import TweetForm from '@/components/TweetForm'
import TweetList from '@/components/TweetList'

const tweets = ref([])
const loading = ref(true)
const { wallet } = useWorkspace()

watchEffect(() => {
    if (! wallet.value) return
    fetchTweets([authorFilter(wallet.value.publicKey.toBase58())])
        .then(fetchedTweets => tweets.value = fetchedTweets)
        .finally(() => loading.value = false)
})

const addTweet = tweet => tweets.value.push(tweet)
</script>

<template>
    <tweet-form @added="addTweet"></tweet-form>
    <tweet-list :tweets="tweets" :loading="loading"></tweet-list>
</template>
