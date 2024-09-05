import { Icon } from '@chakra-ui/react';
import {
  MdHome,
  MdInsertChartOutlined,
  MdOutlineLightbulb,
  MdOutlineNotificationImportant
} from 'react-icons/md';

// Auth Imports
import { IRoute } from 'types/navigation';

import Cookies from 'js-cookie';
import { decodeJwt } from 'jose';

const token = Cookies.get('accessJWT');
let userType: string | null = null;

if ( token ) {
  try {
    const decodedToken = decodeJwt(token);
    userType = decodedToken.userType as string;
  } catch (error) {
    console.error('Error decoding token:', error);
  }
}

const routes: IRoute[] = [
  {
    name: 'Home',
    path: '/home',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Main Dashboard',
        layout: '/admin',
        path: '/dashboards/default',
      },
      {
        name: 'Car Interface',
        layout: '/admin',
        path: '/dashboards/car-interface',
      },
      {
        name: 'Smart Home',
        layout: '/admin',
        path: '/dashboards/smart-home',
      },
      {
        name: 'RTL',
        layout: '/rtl',
        path: '/dashboards/rtl',
      },
    ],
  },
  {
    name: 'Predicción Manual',
    path: '/manualprediction',
    icon: (
      <Icon
        as={MdOutlineLightbulb}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    collapse: true,
    items: [
      {
        name: 'Marketplace',
        layout: '/admin',
        path: '/nfts/marketplace',
        secondary: true,
      },
      {
        name: 'Collection',
        layout: '/admin',
        path: '/nfts/collection',
        secondary: true,
      },
      {
        name: 'NFT Page',
        layout: '/admin',
        path: '/nfts/page',
        secondary: true,
      },
      {
        name: 'Profile',
        layout: '/admin',
        path: '/nfts/profile',
        secondary: true,
      },
    ],
  },
  {
    name: 'Monitorización',
    path: '/monitorizacion',
    icon: (
      <Icon
        as={MdInsertChartOutlined}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    collapse: true,
    items: [
    ],
  },
  ...(userType === 'admin' 
    ? [
    {
      name: 'Alertas',
      path: '/alerts',
      icon: (
        <Icon
          as={MdOutlineNotificationImportant}
          width="20px"
          height="20px"
          color="inherit"
        />
      ),
      collapse: true,
      items: [
      ],
    },
  ] : []),
  /*
  // // --- Main pages ---
  {
    name: 'Main Pages',
    path: '/main',
    icon: <Icon as={MdDashboard} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      {
        name: 'Account',
        path: '/main/account',
        collapse: true,
        items: [
          {
            name: 'Billing',
            layout: '/admin',
            path: '/main/account/billing',
          },
          {
            name: 'Application',
            layout: '/admin',
            path: '/main/account/application',
          },
          {
            name: 'Invoice',
            layout: '/admin',
            path: '/main/account/invoice',
          },
          {
            name: 'Settings',
            layout: '/admin',
            path: '/main/account/settings',
          },
          {
            name: 'All Courses',
            layout: '/admin',
            path: '/main/account/all-courses',
          },
          {
            name: 'Course Page',
            layout: '/admin',
            path: '/main/account/course-page',
          },
        ],
      },
      {
        name: 'Ecommerce',
        path: '/main/users',
        collapse: true,
        items: [
          {
            name: 'New Product',
            layout: '/admin',
            path: '/main/ecommerce/new-product',
          },
          {
            name: 'Product Settings',
            layout: '/admin',
            path: '/main/ecommerce/settings',
          },
          {
            name: 'Product Page',
            layout: '/admin',
            path: '/main/ecommerce/page-example',
          },
          {
            name: 'Order List',
            layout: '/admin',
            path: '/main/ecommerce/order-list',
          },
          {
            name: 'Order Details',
            layout: '/admin',
            path: '/main/ecommerce/order-details',
          },
          {
            name: 'Referrals',
            layout: '/admin',
            path: '/main/ecommerce/referrals',
          },
        ],
      },
      {
        name: 'Users',
        path: '/main/users',
        collapse: true,
        items: [
          {
            name: 'New User',
            layout: '/admin',
            path: '/main/users/new-user',
          },
          {
            name: 'Users Overview',
            layout: '/admin',
            path: '/main/users/users-overview',
          },
          {
            name: 'Users Reports',
            layout: '/admin',
            path: '/main/users/users-reports',
          },
        ],
      },
      {
        name: 'Applications',
        path: '/main/applications',
        collapse: true,
        items: [
          {
            name: 'Kanban',
            layout: '/admin',
            path: '/main/applications/kanban',
          },
          {
            name: 'Data Tables',
            layout: '/admin',
            path: '/main/applications/data-tables',
          },
          {
            name: 'Calendar',
            layout: '/admin',
            path: '/main/applications/calendar',
          },
        ],
      },
      {
        name: 'Profile',
        path: '/main/profile',
        collapse: true,
        items: [
          {
            name: 'Profile Overview',
            layout: '/admin',
            path: '/main/profile/overview',
          },
          {
            name: 'Profile Settings',
            layout: '/admin',
            path: '/main/profile/settings',
          },
          {
            name: 'News Feed',
            layout: '/admin',
            path: '/main/profile/newsfeed',
          },
        ],
      },
      {
        name: 'Others',
        path: '/main/others',
        collapse: true,
        items: [
          {
            name: 'Notifications',
            layout: '/admin',
            path: '/main/others/notifications',
          },
          {
            name: 'Pricing',
            layout: '/auth',
            path: '/main/others/pricing',
          },
          {
            name: '404',
            layout: '/admin',
            path: '/main/others/404',
          },
        ],
      },
    ],
  },
  */
  /*
  // --- Authentication ---
  {
    name: 'Authentication',
    path: '/auth',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    collapse: true,
    items: [
      // --- Sign In ---
      {
        name: 'Sign In',
        path: '/sign-in',
        collapse: true,
        items: [
          {
            name: 'Default',
            layout: '/auth',
            path: '/sign-in/default',
          },
          {
            name: 'Centered',
            layout: '/auth',
            path: '/sign-in/centered',
          },
        ],
      },
      // --- Sign Up ---
      {
        name: 'Sign Up',
        path: '/sign-up',
        collapse: true,
        items: [
          {
            name: 'Default',
            layout: '/auth',
            path: '/sign-up/default',
          },
          {
            name: 'Centered',
            layout: '/auth',
            path: '/sign-up/centered',
          },
        ],
      },
      // --- Verification ---
      {
        name: 'Verification',
        path: '/verification',
        collapse: true,
        items: [
          {
            name: 'Default',
            layout: '/auth',
            path: '/verification/default',
          },
          {
            name: 'Centered',
            layout: '/auth',
            path: '/verification/centered',
          },
        ],
      },
      // --- Lock ---
      {
        name: 'Lock',
        path: '/lock',
        collapse: true,
        items: [
          {
            name: 'Default',
            layout: '/auth',
            path: '/lock/default',
          },
          {
            name: 'Centered',
            layout: '/auth',
            path: '/lock/centered',
          },
        ],
      },
      // --- Forgot Password ---
      {
        name: 'Forgot Password',
        path: '/forgot-password',
        collapse: true,
        items: [
          {
            name: 'Default',
            layout: '/auth',
            path: '/forgot-password/default',
          },
          {
            name: 'Centered',
            layout: '/auth',
            path: '/forgot-password/centered',
          },
        ],
      },
    ],
  },
  */
];  

export default routes;
