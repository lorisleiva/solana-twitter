<script setup>
import { initWorkspace } from '../useWorkspace'

const props = defineProps({
    network: {
        type: String,
        default: 'http://127.0.0.1:8899',
    },
    commitment: {
        type: String,
        default: 'processed',
    },
})

initWorkspace(props.network, props.commitment)
</script>

<template>
    <slot></slot>
</template>
