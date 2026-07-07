import { createRouter, createWebHistory } from 'vue-router'
import { useCustomCursor } from '@/composables/useCustomCursor'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/pages/AboutPage.vue')
    },
    {
      path: '/work',
      name: 'work',
      component: () => import('@/pages/WorkPage.vue')
    },
    {
      path: '/work/:slug',
      name: 'project-detail',
      component: () => import('@/pages/ProjectDetailPage.vue'),
      props: true
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFoundPage.vue')
    }
  ]
})

// Clicking a `router-link` (e.g. a ProjectCard set to the 'view' cursor on
// hover) navigates immediately — the element can unmount before the browser
// ever fires `mouseleave` on it, so the cursor's reset() call never runs and
// it gets stuck enlarged/labelled on the page you land on. Resetting on every
// navigation is a single, reliable backstop regardless of which component
// (or which future one) set the cursor state.
router.afterEach(() => {
  useCustomCursor().reset()
})

export default router
