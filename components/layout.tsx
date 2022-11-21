/* eslint-disable @next/next/no-html-link-for-pages */
import { UserContext } from "@auth0/nextjs-auth0";
import utilStyles from "../styles/utils.module.css";
import UserCard from "./userCard";

export default function Layout(children: { children: any }) {
  return (
    <>
      <nav className={utilStyles.navBar}>
        <div className="sidebar-header">
          Classes
          <hr />
        </div>
        <main>{children.children[0]}</main>
        <UserCard></UserCard>
      </nav>
      <main className={utilStyles.content}>{children.children[1]}</main>
    </>
  );
}
