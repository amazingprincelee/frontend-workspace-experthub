import { useMemo } from "react";
import CreateWorkspaceComponent from "@/components/create-workspace/CreateWorkspace";


const Dashboard = () => <h1>Dashboard</h1>;
const Clients = () => <h1>Clients</h1>;
const Workspaces = () => <h1>Workspaces</h1>;
const CreateWorkspace = () => <CreateWorkspaceComponent />;
const Wallet = () => <h1>Wallet</h1>;
const Support = () => <h1>Support</h1>;


const componentsMap: { [key: string]: () => JSX.Element } = {
  dashboard: Dashboard,
  clients: Clients,
  workspaces: Workspaces,
  createspace: CreateWorkspace,
  wallet: Wallet,
  support: Support,
  
};

export default function Page({ params }: { params: { slug: string } }) {
  const Component = useMemo(() => componentsMap[params.slug] || (() => <h1>404 Not Found</h1>), [params.slug]);

  return <Component />;
}
