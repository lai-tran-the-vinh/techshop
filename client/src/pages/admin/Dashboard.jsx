import { useEffect } from "react";
import { useAppContext } from "@contexts";

function Dashboard() {
  const { setSideBarSelectedTab } = useAppContext();

  useEffect(() => {
    setSideBarSelectedTab("Trang chủ");
  }, []);

  return <h1>Dashboard</h1>;
}

export default Dashboard;
