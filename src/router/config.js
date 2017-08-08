const _import = require('./_import_' + process.env.NODE_ENV);

let config = [
    {
        path: '/',
        meta: {},
        component: _import('serve-list')
    },
    {
        path: '/home',
        name: 'home',
        meta: {},
        component: _import('serve-list')
    },
    {
        path: '/test',
        name: 'test',
        meta: {},
        component: _import('test')
    },
    {
        name: 'store-list',
        path: '/store-list/:businessId/:productId',
        meta: {
            title:'门店列表'
        },
        component: _import('store-list')
    },
    {
        path: '/map-guide/:businessId/:productId/:x/:y',
        name: 'map-guide',
        meta: {},
        component: _import('map-guide')
    },
    {
        path: '/list',
        name: 'list',
        meta: {
            storePostion: true,
            storeWhenGo: ['detail'],
        },
        component: resolve => require(['@/pages/list/list'], resolve)
    },
    {
        name: 'detail',
        path: '/detail/:id',
        meta: {},
        component: resolve => require(['@/pages/detail/detail'], resolve)
    },
    {
        name: 'serve-detail',
        path: '/serve-detail/:businessId/:productId',
        meta: {},
        component: _import('serve-detail')
    },
    {
        name: 'order-detail',
        path: '/order-detail/:orderId',
        meta: {},
        component: _import('order-detail')
    },
     {
        name: 'comment-list',
        path: '/comment-list/:productId',
        meta: {},
        component: _import('comment-list')
    },
    {
        name: 'graphic-details',
        path: '/graphic-details/:businessId/:productId',
        meta: {},
        component: _import('graphic-details')
    },
    {
        name: 'submit-order',
        path: '/submit-order/:businessId/:productId',
        meta: {},
        component: _import('submit-order')
    },
    {
        name: 'pay-center',
        path: '/pay-center/:orderId',
        meta: {},
        component: _import('pay-center')
    },
    {
        name: 'pay-success',
        path: '/pay-success/:orderId',
        meta: {},
        component: _import('pay-success')

    },
    {
        name: 'order-list',
        path: '/order-list',
        meta: {},
        component: _import('order-list')
    },
    {
        name: 'order-list',
        path: '/order-list/:backApp',
        meta: {},
        component: _import('order-list')
    },
    {
        name: 'submit-comment',
        path: '/submit-comment/:orderId/:status',
        meta: {},
        component: _import('submit-comment')
    },
    {
        name: 'comment-success',
        path: '/comment-success/:orderId',
        meta: {},
        component: _import('comment-success')
    },
    {
        name: 'history-back-skip',
        path: '/history-back-skip',
        meta: {},
        component: _import('history-back-skip')
    },
     {
        name: 'go-pay',
        path: '/go-pay/:orderId/:pdSn/:amount',
        meta: {},
        component: _import('go-pay')
    }
]

export default config