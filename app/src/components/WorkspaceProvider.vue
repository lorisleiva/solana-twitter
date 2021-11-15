<script setup>
import { initWorkspace } from '@/composables'
initWorkspace(process.env.VUE_APP_CLUSTER, 'processed')
</script>

<template>
    <slot></slot>
</template>
