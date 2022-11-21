/* eslint-disable @next/next/no-html-link-for-pages */
import { useUser } from "@auth0/nextjs-auth0";
import utilStyles from "../styles/utils.module.css";

export default function UserCard() {
  const { user, isLoading, error } = useUser();
  if (isLoading) return <div>Loading</div>;
  if (error) return <div>{error.message}</div>;
  if (!user)
    return (
      <div>
        <a href="/api/auth/login">Login</a>
      </div>
    );
  else
    return (
      user && (
        <div className={utilStyles.userCard + " card"}>
          <h5>{user.name}</h5>
          <p>{user.email}</p>
          <a href="/api/auth/logout">Logout</a>
        </div>
      )
    );
}
