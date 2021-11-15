<script setup>
import { toRefs } from 'vue'

const props = defineProps({
    tweet: Object,
})

const { tweet } = toRefs(props)
</script>

<template>
    <div class="px-8 py-4">
        <div>
            <h3 class="inline font-semibold" :title="tweet.author">
                <router-link :to="{ name: 'Users', params: { author: tweet.author.toBase58() } }" class="hover:underline">
                    {{ tweet.author_display }}
                </router-link>
            </h3>
            <span class="text-gray-500"> • </span>
            <time class="text-gray-500 text-sm" v-text="tweet.created_ago" :title="tweet.created_at"></time>
        </div>
        <p class="whitespace-pre-wrap" v-text="tweet.content"></p>
        <router-link v-if="tweet.topic" :to="{ name: 'Topics', params: { topic: tweet.topic } }" class="inline-block mt-2 text-pink-500 hover:underline">
            #{{ tweet.topic }}
        </router-link>
    </div>
</template>
