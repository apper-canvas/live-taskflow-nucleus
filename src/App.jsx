import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '@/Layout';
import { routes } from '@/config/routes';
import { store } from '@/store';
import { setUser, clearUser } from '@/store/userSlice';

function AppContent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const IndexComponent = routes[0].component;

  useEffect(() => {
    const { ApperUI } = window.ApperSDK;
    
    ApperUI.setup({
      selector: '#apper-ui',
      projectId: import.meta.env.VITE_APPER_PROJECT_ID,
      publicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      onSuccess: function (user) {
        // CRITICAL: This exact currentPath logic must be preserved
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/today');
            }
          } else {
            navigate('/today');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      }
    });
  }, [navigate, dispatch]);

  return (
    <>
      <div id="apper-ui"></div>
      <Routes>
        <Route path="/" element={<Layout />}>
          {routes.map(route => {
            const RouteComponent = route.component;
            return (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<RouteComponent />} 
              />
            );
          })}
          <Route index element={<IndexComponent />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        className="z-[9999]"
        toastClassName="bg-white border border-gray-200 shadow-lg"
        progressClassName="bg-primary"
      />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;