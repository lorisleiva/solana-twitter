<script setup>
import { toRefs } from 'vue'

const props = defineProps({
    publicKey: String,
})

const { publicKey } = toRefs(props)
</script>

<template>
    <div class="px-8 py-4">
        <h2 class="text-xl font-semibold" v-text="publicKey"></h2>
    </div>
</template>
