<script setup>
import { computed, toRefs } from 'vue'
import TweetCard from '@/components/TweetCard'

const emit = defineEmits(['update:tweets', 'more'])
const props = defineProps({
    tweets: Array,
    loading: Boolean,
    hasMore: Boolean,
})

const { tweets, loading, hasMore } = toRefs(props)
const orderedTweets = computed(() => {
    return tweets.value.slice().sort((a, b) => b.timestamp - a.timestamp)
})

const onDelete = deletedTweet => {
    const filteredTweets = tweets.value.filter(tweet => tweet.publicKey.toBase58() !== deletedTweet.publicKey.toBase58())
    emit('update:tweets', filteredTweets)
}
</script>

<template>
    <div class="divide-y">
        <tweet-card v-for="tweet in orderedTweets" :key="tweet.key" :tweet="tweet" @delete="onDelete"></tweet-card>
        <div v-if="loading" class="p-8 text-gray-500 text-center">
            Loading...
        </div>
        <div v-else-if="hasMore" class="p-8 text-center">
            <button @click="emit('more')" class="px-4 py-2 rounded-full border bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900">
                Load more
            </button>
        </div>
    </div>
</template>
