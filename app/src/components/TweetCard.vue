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
                <!-- TODO: Link to author page or the profile page if it's our own tweet. -->
                <router-link :to="{ name: 'Home' }" class="hover:underline">
                    {{ tweet.author_display }}
                </router-link>
            </h3>
            <span class="text-gray-500"> • </span>
            <time class="text-gray-500 text-sm" :title="tweet.created_at">
                <!-- TODO: Link to the tweet page. -->
                <router-link :to="{ name: 'Home' }" class="hover:underline">
                    {{ tweet.created_ago }}
                </router-link>
            </time>
        </div>
        <p class="whitespace-pre-wrap" v-text="tweet.content"></p>
        <!-- TODO: Link to the topic page. -->
        <router-link v-if="tweet.topic" :to="{ name: 'Home' }" class="inline-block mt-2 text-pink-500 hover:underline">
            #{{ tweet.topic }}
        </router-link>
    </div>
</template>
