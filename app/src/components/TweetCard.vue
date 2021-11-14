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
            <h3 class="inline font-semibold" v-text="tweet.author_display" :title="tweet.author"></h3>
            <time class="text-gray-500"> • 1h</time>
        </div>
        <p class="whitespace-pre-wrap" v-text="tweet.content"></p>
        <a href="#" v-if="tweet.topic" class="inline-block mt-2 text-pink-500 hover:underline">
            #{{ tweet.topic }}
        </a>
    </div>
</template>
