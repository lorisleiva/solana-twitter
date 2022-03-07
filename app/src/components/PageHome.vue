<script setup>
import { ref } from 'vue'
import { paginateTweets } from '@/api'
import TweetForm from '@/components/TweetForm'
import TweetList from '@/components/TweetList'

const tweets = ref([])
const onNewPage = newTweets => tweets.value.push(...newTweets)
const { prefetch, getNextPage, loading } = paginateTweets([], 10, onNewPage)
prefetch().then(getNextPage)

const addTweet = tweet => tweets.value.push(tweet)
</script>

<template>
    <tweet-form @added="addTweet"></tweet-form>
    <tweet-list v-model:tweets="tweets" :loading="loading"></tweet-list>
</template>
