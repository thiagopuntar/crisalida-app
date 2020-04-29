const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { 
        path: '', 
        component: () => import('pages/Login.vue'),
        meta: { public: true },
        name: 'login'
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    // Rotas da aplicação logada!!!
    children: [
      { 
        path: '/home', 
        component: () => import('pages/Index.vue'),
        name: 'home',
        title: 'Início',
        icon: 'home',
      },
      {
        path: '/orders', 
        component: () => import('pages/OrderList.vue'),
        name: 'orders',
        title: 'Pedidos',
        icon: 'list',
        children: [
          { 
            path: '/orders/new', 
            component: () => import('pages/OrderForm.vue'),
            name: 'newOrder',
            children: [
              { 
                path: '/order/new/newCustomer/:customerName',
                component: () => import('pages/CustomerForm.vue'),
                name: 'orderNewCustomer',
                props: true
              },
              { 
                path: '/order/new/newProduct/:productName',
                component: () => import('pages/ProductForm.vue'),
                name: 'orderNewProduct',
                props: true
              }
            ]
          },
          { 
            path: '/orders/edit/:id', 
            component: () => import('pages/OrderForm.vue'),
            name: 'editOrder'
          },
        ]
      },
      {
        path: '/customers', 
        component: () => import('pages/CustomerList.vue'),
        name: 'customers',
        title: 'Clientes',
        icon: 'contacts',
        children: [
          { 
            path: '/customers/new', 
            component: () => import('pages/CustomerForm.vue'),
            name: 'newCustomer'
          },
          { 
            path: '/customers/:id', 
            component: () => import('pages/CustomerForm.vue'),
            name: 'editCustomer'
          },
        ]
      },
      {
        path: '/products', 
        component: () => import('pages/ProductList.vue'),
        name: 'products',
        title: 'Produtos',
        icon: 'kitchen',
        children: [
          { 
            path: '/products/new', 
            component: () => import('pages/ProductForm.vue'),
            name: 'newProduct'
          },
          { 
            path: '/products/:id', 
            component: () => import('pages/ProductForm.vue'),
            name: 'editProduct'
          },
        ]
      },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
