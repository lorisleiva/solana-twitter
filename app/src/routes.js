export default [
    {
        path: '/',
        component: require('@/components/PageHome').default,
        meta: { title: 'Home' },
    },
    {
        path: '/topics',
        component: require('@/components/PageTopics').default,
        meta: { title: 'Topics' },
    },
    {
        path: '/users',
        component: require('@/components/PageUsers').default,
        meta: { title: 'Users' },
    },
    {
        path: '/profile',
        component: require('@/components/PageProfile').default,
        meta: { title: 'Profile' },
    },
]
