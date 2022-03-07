<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { paginateTweets, authorFilter } from '@/api'
import { useFromRoute } from '@/composables'
import TweetList from '@/components/TweetList'
import TweetSearch from '@/components/TweetSearch'

// Data.
const router = useRouter()
const tweets = ref([])
const author = ref('')
const viewedAuthor = ref('')
const filters = ref([])

const onNewPage = newTweets => tweets.value.push(...newTweets)
const { prefetch, hasNextPage, getNextPage, loading } = paginateTweets(filters, 10, onNewPage)

// Actions.
const search = () => {
    router.push(`/users/${author.value}`)
}

const fetchAuthorTweets = () => {
    if (author.value === viewedAuthor.value) return;
    tweets.value = []
    viewedAuthor.value = author.value
    filters.value = [authorFilter(author.value)]
    prefetch().then(getNextPage)
}

// Router hooks.
useFromRoute((route) => {
    author.value = route.params.author
    if (author.value) {
        fetchAuthorTweets()
    } else {
        tweets.value = []
        viewedAuthor.value = ''
    }
})
</script>

<template>
    <tweet-search placeholder="public key" :disabled="! author" v-model="author" @search="search">
        <template #icon>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
        </template>
    </tweet-search>
    <div v-if="viewedAuthor">
        <tweet-list v-model:tweets="tweets" :loading="loading" :has-more="hasNextPage" @more="getNextPage"></tweet-list>
        <div v-if="!loading && tweets.length === 0" class="p-8 text-gray-500 text-center">
            User not found...
        </div>
    </div>
</template>
