export default [
    {
        path: '/',
        component: require('@/components/PageHome').default,
        meta: { title: 'Home' },
    },
    {
        path: '/topics/:topic?',
        component: require('@/components/PageTopics').default,
        meta: { title: 'Topics' },
    },
    {
        path: '/users/:author?',
        component: require('@/components/PageUsers').default,
        meta: { title: 'Users' },
    },
    {
        path: '/profile',
        component: require('@/components/PageProfile').default,
        meta: { title: 'Profile' },
    },
]
