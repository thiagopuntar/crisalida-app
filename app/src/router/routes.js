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
        path: '/order/new', 
        component: () => import('pages/OrderForm.vue'),
        name: 'newOrder',
        title: 'Novo Pedido',
        children: [
          { 
            path: '/order/new/newCustomer',
            component: () => import('pages/CustomerForm.vue'),
            name: 'orderNewCustomer',
          }
        ]
      },
      {
        path: '/customers', 
        component: () => import('pages/CustomerList.vue'),
        name: 'customers',
        title: 'Clientes',
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
