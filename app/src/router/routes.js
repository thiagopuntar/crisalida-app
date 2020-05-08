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
            path: 'new', 
            component: () => import('pages/OrderForm.vue'),
            name: 'newOrder',
            children: [
              { 
                path: 'newCustomer/:customerName',
                component: () => import('pages/CustomerForm.vue'),
                name: 'newOrderNewCustomer',
                props: true
              },
              { 
                path: 'customers/:id',
                component: () => import('pages/CustomerForm.vue'),
                name: 'newOrderEditCustomer'
              },
              { 
                path: 'newProduct/:productName',
                component: () => import('pages/ProductForm.vue'),
                name: 'newOrderNewProduct',
                props: true
              }
            ]
          },
          { 
            path: ':orderId', 
            component: () => import('pages/OrderForm.vue'),
            name: 'editOrder',
            children: [
              { 
                path: 'newCustomer/:customerName',
                component: () => import('pages/CustomerForm.vue'),
                name: 'orderNewCustomer',
                props: true
              },
              { 
                path: 'customers/:id',
                component: () => import('pages/CustomerForm.vue'),
                name: 'orderEditCustomer'
              },
              { 
                path: 'newProduct/:productName',
                component: () => import('pages/ProductForm.vue'),
                name: 'orderNewProduct',
                props: true
              }
            ]
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
            path: 'new', 
            component: () => import('pages/CustomerForm.vue'),
            name: 'newCustomer'
          },
          { 
            path: ':id', 
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
            path: 'new', 
            component: () => import('pages/ProductForm.vue'),
            name: 'newProduct'
          },
          { 
            path: ':id', 
            component: () => import('pages/ProductForm.vue'),
            name: 'editProduct'
          },
        ]
      },
      {
        path: '/suppliers',
        component: () => import('pages/SupplierList.vue'),
        name: 'suppliers',
        title: 'Fornecedores',
        icon: 'business',
        children: [
          { 
            path: 'new', 
            component: () => import('pages/SupplierForm.vue'),
            name: 'newSupplier'
          },
          { 
            path: ':id', 
            component: () => import('pages/SupplierForm.vue'),
            name: 'editSupplier'
          },
        ]
      }
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
