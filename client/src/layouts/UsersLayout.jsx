import { Outlet } from "react-router";

function UsersLayout() {
  return (
    <div>
      <header>
        <h3>TECHSHOP</h3>
      </header>
      <div>
        <Outlet />
      </div>
      <footer>Footer</footer>
    </div>
  );
}

export default UsersLayout;
