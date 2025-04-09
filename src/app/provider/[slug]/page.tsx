import { useMemo } from "react";
import CreateWorkspaceComponent from "@/components/create-workspace/CreateWorkspace";
import ClientsComponent from '@/components/provider/provider-client';
import ProviderWorkspaces from '@/components/provider/provider-workspaces'


const Dashboard = () => <h1>Dashboard</h1>;
const Clients = () => <ClientsComponent />
const Workspaces = () => <ProviderWorkspaces />;
const Wallet = () => <h1>Wallet</h1>;
const Support = () => <h1>Support</h1>;
const CreateWorkspace = () => <CreateWorkspaceComponent />;




const componentsMap: { [key: string]: () => JSX.Element } = {
  dashboard: Dashboard,
  clients: Clients,
  workspaces: Workspaces,
  wallet: Wallet,
  support: Support,
  createspace: CreateWorkspace,
  
};

export default function Page({ params }: { params: { slug: string } }) {
  const Component = useMemo(() => componentsMap[params.slug] || (() => <h1>404 Not Found</h1>), [params.slug]);

  return <Component />;
}
