import { createBrowserRouter } from 'react-router';
import { MainInterface } from '@/app/pages/MainInterface';
import { TaskTable } from '@/app/pages/TaskTable';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainInterface,
  },
  {
    path: '/tasks',
    Component: TaskTable,
  },
]);