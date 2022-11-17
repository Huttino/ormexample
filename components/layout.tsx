import utilStyles from "../styles/utils.module.css";

export default function Layout(children: { children: any }) {
  return (
    <>
      <nav className={utilStyles.navBar}>
        <div className="sidebar-header">Classes</div>
        <main>{children.children[0]}</main>
      </nav>
      <main className={utilStyles.content}>{children.children[1]}</main>
    </>
  );
}
