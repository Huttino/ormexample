import { AppProps } from "next/app";
import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.css";
import Layout from "../components/layout";
import utilStyle from "../styles/utils.module.css";
import ClassMenu from "../components/classMenu";
import { UserProvider } from "@auth0/nextjs-auth0";

function App({ Component, pageProps }: AppProps) {
  return (
    <div className={utilStyle.wrapper}>
      <UserProvider>
        <Layout>
          <ClassMenu />
          <Component {...pageProps} />
        </Layout>
      </UserProvider>
    </div>
  );
}

export default App;
