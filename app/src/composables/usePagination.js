import { computed, ref } from 'vue';

export const usePagination = (perPage, prefetchCb, pageCb) => {
    perPage = ref(perPage);
    const allPublicKeys = ref([]);
    const prefetchLoading = ref(true);
    const pageLoading = ref(false);
    const loading = computed(() => prefetchLoading.value || pageLoading.value);

    let prefetchPromise = null

    const prefetch = () => {
        prefetchPromise = (async () => {
            try {
                prefetchLoading.value = true
                allPublicKeys.value = await prefetchCb()
            } finally {
                prefetchLoading.value = false
            }
        })()

        return prefetchPromise
    }

    const getPagePublicKeys = (page) => {
        return allPublicKeys.value.slice(
            (page - 1) * perPage.value,
            page * perPage.value,
        );
    }
    
    const hasPage = (page) => {
        return getPagePublicKeys(page).length > 0;
    }

    const getPage = async (page) => {
        await prefetchPromise;
        if (!hasPage(page)) return [];
        try {
            pageLoading.value = true;
            return await pageCb(page, getPagePublicKeys(page));
        } finally {
            pageLoading.value = false;
        }
    }

    return {
        perPage,
        allPublicKeys,
        prefetchLoading,
        pageLoading,
        loading,
        getPagePublicKeys,
        hasPage,
        getPage,
        prefetch,
    };
}
