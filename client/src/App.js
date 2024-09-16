//Global Styles
import styles from "./styles/App.module.scss";

//React Router
import { Routes, Route } from "react-router-dom";

//Components
import PageContainer from "./components/Containers/PageContainer";
import MainContainer from "./components/Containers/MainContainer";
import PageLayout from "./components/PageLayout";
import AuthGuard from "./components/AuthGuard";
// import Interceptor from "./components/Interceptor";

// Pages
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import TransactionsRoot from "./pages/TransactionsRoot";
import CategoriesRoot from "./pages/CategoriesRoot";

// Transactions Subpages
import TransactionCreate from "./components/TransactionComponents/TransactionCreate";
import TransactionDelete from "./components/TransactionComponents/TransactionDelete";

// Categories Subpages
import Categories from "./components/CategoriesComponents/Categories";
import CategoryCreate from "./components/CategoriesComponents/CategoryCreate";
import CategoryDelete from "./components/CategoriesComponents/CategoryDelete";

// React Query
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClientProvider } from "react-query";
import { queryClient } from "./constants/config";

function App() {
  return (
    <div className={styles.App}>
      <QueryClientProvider client={queryClient}>
        {/* <Interceptor /> */}
        <AuthGuard>
          <PageContainer optionClass={styles.pageContainer}>
            <Routes>
              {/* Login Page  */}
              <Route path="/auth" element={<Auth />} />

              {/* Register Page  */}
              <Route path="/register" element={<Register />} />

              {/* Page Layout */}
              <Route element={<PageLayout />}>
                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* Settings  */}
                <Route path="settings" element={<Settings />} />

                {/* Profile */}
                <Route path="profile" element={<Profile />} />

                {/* Transactions  */}
                <Route path="transactions" element={<TransactionsRoot />}>
                  <Route index element={<TransactionCreate />} />
                  <Route path="create" element={<TransactionCreate />} />
                  <Route path="delete" element={<TransactionDelete />} />
                </Route>

                {/* Categories */}
                <Route path="categories" element={<CategoriesRoot />}>
                  <Route index element={<Categories />} />
                  <Route path="results" element={<Categories />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="delete" element={<CategoryDelete />} />
                </Route>

                {/* 404 */}
                <Route
                  path="/*"
                  element={
                    <MainContainer>
                      <span style={{ fontSize: "1.2rem" }}>
                        404 Page Not Found
                      </span>
                    </MainContainer>
                  }
                />
              </Route>
            </Routes>
          </PageContainer>
        </AuthGuard>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </div>
  );
}

export default App;

// import "./App.css";

// function App() {
//   return (
//     <div className="App">
//       <h1> Hello </h1>
//     </div>
//   );
// }

// export default App;
