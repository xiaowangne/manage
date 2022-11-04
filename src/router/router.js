export default [{
    path: '/register',
    name:"Register",
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name:"Login",
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    name:"Main",
    component: () => import('../views/Main.vue'),
    children: [{
        path: '/home',
        name:"Home",
        component: () => import('../views/Home.vue'),
      },
      {
        path: '/articleTypeList',
        name:"ArticleTypeList",
        component: () => import('../views/ArticleTypeList.vue'),
      },
      {
        path: '/articleType',
        name:'ArticleType',
        component: () => import('../views/ArticleType.vue'),
      },
      {
        path: '/articleList',
        name:"ArticleList",
        component: () => import('../views/ArticleList.vue'),
      },
      {
        path: '/addArticle',
        name:'AddArticle',
        component: () => import('../views/AddArticle.vue'),
      },
      {
        path: '/bannerType',
        name:'BannerType',
        component: () => import('../views/BannerType.vue'),
      },
      {
        path: '/bannerTypeList',
        name:'BannerTypeList',
        component: () => import('../views/BannerTypeList.vue'),
      },
      {
        path: '/addBanner',
        name:'AddBanner',
        component: () => import('../views/AddBanner.vue'),
      },
      {
        path: '/bannerList',
        name:'BannerList',
        component: () => import('../views/BannerList.vue'),
      },
      {
        path: '/',
        name:'System',
        component: () => import('../views/System.vue'),
      },
    ],
  }, {
    path:"/:pathMatch(.*)",
    redirect: {
      name: 'System'
    }
  }
]