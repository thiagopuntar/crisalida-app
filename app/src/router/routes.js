
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
        children: [
          { 
            path: '/home/employees/:id',
            component: () => import('pages/EmployeeForm.vue'),
            name: 'employeePendency'
          },
          { 
            path: '/home/documents/:id',
            component: () => import('pages/DocumentForm.vue'),
            name: 'documentPendency'
          },
          { 
            path: '/home/trainings/:id',
            component: () => import('pages/TrainingForm.vue'),
            name: 'trainingPendency'
          }
        ]
      },
      { 
        path: '/employees',
        component: () => import('pages/Employee.vue'),
        title: 'Colaboradores',
        icon: 'face',
        name: 'employees',
        children: [
          { 
            path: '/employees/new',
            component: () => import('pages/EmployeeForm.vue'),
            name: 'newEmployee'
          },
          { 
            path: '/employees/:id',
            component: () => import('pages/EmployeeForm.vue'),
            name: 'editEmployee'
          }
        ]
      },
      { 
        path: '/documents',
        component: () => import('pages/Document.vue'),
        title: 'Documentos',
        icon: 'file_copy',
        name: 'documents',
        children: [
          { 
            path: '/documents/new',
            component: () => import('pages/DocumentForm.vue'),
            name: 'newDocument'
          },
          { 
            path: '/documents/:id',
            component: () => import('pages/DocumentForm.vue'),
            name: 'editDocument'
          },
          { 
            path: '/documents/attachment',
            component: () => import('pages/DocumentAttachment.vue'),
            name: 'newAttachment'
          },
          { 
            path: '/documents/attachment/:id',
            component: () => import('pages/DocumentAttachment.vue'),
            name: 'editAttachment'
          }
        ]
      },
      { 
        path: '/training',
        component: () => import('pages/Training.vue'),
        title: 'Treinamentos',
        icon: 'event',
        name: 'training',
        children: [
          { 
            path: '/training/new',
            component: () => import('pages/TrainingForm.vue'),
            name: 'newTraining'
          },
          { 
            path: '/training/:id',
            component: () => import('pages/TrainingForm.vue'),
            name: 'editTraining'
          },
          { 
            path: '/training/finishing/:id',
            component: () => import('pages/TrainingDoneForm.vue'),
            name: 'finishTraining'
          }
        ]
      },
      { 
        path: '/suppliers',
        component: () => import('pages/Supplier.vue'),
        title: 'Qualificação de fornecedores',
        icon: 'business',
        name: 'suppliers',
        children: [
          { 
            path: '/suppliers/new',
            component: () => import('pages/SupplierForm.vue'),
            name: 'newSupplier'
          },
          { 
            path: '/suppliers/:id',
            component: () => import('pages/SupplierForm.vue'),
            name: 'editSupplier'
          }
        ]
      },
      { 
        path: '/customers',
        component: () => import('pages/Customer.vue'),
        // title: 'Qualificação de clientes',
        icon: 'storefront',
        name: 'customers'
      },
      { 
        path: '/equipments',
        component: () => import('pages/Equipment.vue'),
        title: 'Manutenção',
        icon: 'build',
        name: 'equip',
        children: [
          { 
            path: '/equipments/new',
            component: () => import('pages/EquipmentForm.vue'),
            name: 'newEquip'
          },
          { 
            path: '/equipments/:id',
            component: () => import('pages/EquipmentForm.vue'),
            name: 'editEquip'
          }
        ]
      },
      { 
        path: '/nonConformancies',
        component: () => import('pages/NonConformancy.vue'),
        title: 'Não conformidades',
        icon: 'report_problem',
        name: 'rnc',
        children: [
          { 
            path: '/nonConformancies/new',
            component: () => import('pages/NonConformancyForm.vue'),
            name: 'newRnc'
          },
          { 
            path: '/nonConformancies/:id',
            component: () => import('pages/NonConformancyForm.vue'),
            name: 'editRnc'
          }
        ]
      },
      { 
        path: '/tasks',
        component: () => import('pages/Task.vue'),
        title: 'Ações e tarefas',
        icon: 'list',
        name: 'task',
        children: [
          { 
            path: '/tasks/new',
            component: () => import('pages/TaskForm.vue'),
            name: 'newTask'
          },
          { 
            path: '/tasks/:id',
            component: () => import('pages/TaskForm.vue'),
            name: 'editTask'
          }
        ]
      },
      { 
        path: '/audits',
        component: () => import('pages/Audit.vue'),
        title: 'Auditorias',
        icon: 'receipt',
        name: 'audit'
      },
      { 
        path: '/settings',
        component: () => import('pages/Settings.vue'),
        name: 'settings'
      },
      { 
        path: '/occupations',
        component: () => import('pages/Occupation.vue'),
        name: 'occupations',
        children: [
          {
            path: '/occupations/new',
            component: () => import('pages/OccupationForm.vue'),
            name: 'newOccupation'
          },
          {
            path: '/occupations/:id',
            component: () => import('pages/OccupationForm.vue'),
            name: 'editOccupation'
          }
        ]
      },
      { 
        path: '/areas',
        component: () => import('pages/Area.vue'),
        name: 'areas'
      },
      { 
        path: '/shifts',
        component: () => import('pages/Shift.vue'),
        name: 'shifts'
      },
      { 
        path: '/documentTypes',
        component: () => import('pages/DocumentType.vue'),
        name: 'documentTypes'
      },
      { 
        path: '/companyRequirements',
        component: () => import('pages/CompanyRequirement.vue'),
        name: 'companyRequirements'
      },
      { 
        path: '/employeeRequirements',
        component: () => import('pages/EmployeeRequirement.vue'),
        name: 'ers'
      },
      { 
        path: '/companyProfiles',
        component: () => import('pages/CompanyProfile.vue'),
        name: 'companyProfiles'
      },
      { 
        path: '/issueCategories',
        component: () => import('pages/IssueCategory.vue'),
        name: 'issueCategories'
      },
      { 
        path: '/users',
        component: () => import('pages/User.vue'),
        name: 'users',
        children: [
          {
            path: '/users/new',
            component: () => import('pages/UserForm.vue'),
            name: 'newUser'
          },
          {
            path: '/users/:id',
            component: () => import('pages/UserForm.vue'),
            name: 'editUser'
          }
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
