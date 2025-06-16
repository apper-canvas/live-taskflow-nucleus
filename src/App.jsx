import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/Layout';
import { routes } from '@/config/routes';

function App() {
  const IndexComponent = routes[0].component;
  
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;