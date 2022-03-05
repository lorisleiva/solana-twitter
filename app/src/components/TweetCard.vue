<script setup>
import { ref, toRefs, computed } from 'vue'
import { useWorkspace } from '@/composables'
import { deleteTweet } from '@/api'
import TweetFormUpdate from './TweetFormUpdate'

const emit = defineEmits(['delete']);
const props = defineProps({
    tweet: Object,
})

const { tweet } = toRefs(props)
const { wallet } = useWorkspace()
const isMyTweet = computed(() => wallet.value && wallet.value.publicKey.toBase58() === tweet.value.author.toBase58())
const authorRoute = computed(() => {
    if (isMyTweet.value) {
        return { name: 'Profile' }
    } else {
        return { name: 'Users', params: { author: tweet.value.author.toBase58() } }
    }
})

const isEditing = ref(false)

const onDelete = async () => {
    await deleteTweet(tweet.value);
    emit('delete', tweet.value)
}
</script>

<template>
    <tweet-form-update v-if="isEditing" :tweet="tweet" @close="isEditing = false"></tweet-form-update>
    <div class="px-8 py-4" v-else>
        <div class="flex justify-between">
            <div class="py-1">
                <h3 class="inline font-semibold" :title="tweet.author">
                    <router-link :to="authorRoute" class="hover:underline">
                        {{ tweet.author_display }}
                    </router-link>
                </h3>
                <span class="text-gray-500"> • </span>
                <time class="text-gray-500 text-sm" :title="tweet.created_at">
                    <router-link :to="{ name: 'Tweet', params: { tweet: tweet.publicKey.toBase58() } }" class="hover:underline">
                        {{ tweet.created_ago }}
                    </router-link>
                </time>
            </div>
            <div class="flex" v-if="isMyTweet">
                <button @click="isEditing = true" class="flex px-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-gray-100" title="Update tweet">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 m-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
                    </svg>
                </button>
                <button @click="onDelete" class="flex px-2 rounded-full text-gray-500 hover:text-pink-500 hover:bg-gray-100" title="Delete tweet">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 m-auto" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
        <p class="whitespace-pre-wrap break-all" v-text="tweet.content"></p>
        <router-link v-if="tweet.topic" :to="{ name: 'Topics', params: { topic: tweet.topic } }" class="inline-block mt-2 text-pink-500 hover:underline break-all">
            #{{ tweet.topic }}
        </router-link>
    </div>
</template>
