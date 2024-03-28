
import { createRouter, createWebHistory } from 'vue-router';
import Dashboard from './components/Dashboard.vue';
import SignUP from './components/SignUP.vue';
import Event from './components/Event.vue';
import InitiateEvent from './pages/InitiateEvent.vue';
import InitiatedEvent from './pages/InitiatedEvent.vue';
import Profile from './components/Profile.vue';
import PersonalActivity from './components/PersonalActivity.vue';
import ProfilePage from './pages/ProfilePage.vue';
const routes = [
  {
    path: '/',
    redirect: '/dashboard/event'
  },
  { path: '/dashboard', 
    component: Dashboard,
    children:[
      {
        path: 'event',
        name:'Event',
        component: Event,
      },
      {
        path: 'initiateEvent',
        name:'InitiateEvent',
        component: InitiateEvent,
      },
      {
        path: 'initiatedEvent',
        name:'InitiatedEvent',
        component: InitiatedEvent,
      },
      {
        path: 'profilepage',
        name: 'ProfilePage',
        component: ProfilePage,
        children:[
          {
            path: 'information',
            name:'Profile',
            component: Profile,
          },
          {
            path: 'activity',
            name:'PersonalActivity',
            component: PersonalActivity,
          }
        ]
      },
    ]
  },
  { path: '/signup', component: SignUP },
  // Add more routes as needed
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
