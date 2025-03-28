import { useMemo } from "react";


const Dashboard = () => <h1>Dashboard</h1>;
const experthub = () => <h1>ExpertHub Workspaces</h1>;
const providersWorkspace = () => <h1>Provider's Workspace</h1>;
const subscriptions = () => <h1>My subscribe workspace</h1>;
const Payments = () => <h1>Payments</h1>;
const Support = () => <h1>Support</h1>;
const Settings = () => <h1>Settings</h1>;

const componentsMap: { [key: string]: () => JSX.Element } = {
  dashboard: Dashboard,
  experthub: experthub,
  provider: providersWorkspace,
  subscriptions: subscriptions,
  payments: Payments,
  support: Support,
  settings: Settings,
};

export default function Page({ params }: { params: { slug: string } }) {
  const Component = useMemo(() => componentsMap[params.slug] || (() => <h1>404 Not Found</h1>), [params.slug]);

  return <Component />;
}
