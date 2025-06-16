import Today from '@/components/pages/Today';
import AllTasks from '@/components/pages/AllTasks';
import Category from '@/components/pages/Category';

export const routes = [
  {
    id: 'today',
    label: 'Today',
    path: '/today',
    icon: 'Calendar',
    component: Today
  },
  {
    id: 'all',
    label: 'All Tasks',
    path: '/all',
    icon: 'List',
    component: AllTasks
  },
  {
    id: 'category',
    label: 'Categories',
    path: '/category/:categoryId?',
    icon: 'Tag',
    component: Category
  }
];