import { useMemo } from "react";
import CreateWorkspaceComponent from "../../../components/create-workspace/CreateWorkspace";
import AddCategoryComponent from "../add-category/addCategory";

const Dashboard = () => <h1>Dashboard</h1>;
const Clients = () => <h1>Clients</h1>;
const Providers = () => <h1>Providers</h1>;
const Workspaces = () => <h1>Workspaces</h1>;
const CreateWorkspace = () => <CreateWorkspaceComponent />;
const AddCategory = () => <AddCategoryComponent />
const Payments = () => <h1>Payments</h1>;
const Support = () => <h1>Support</h1>;
const Reviews = () => <h1>Reviews</h1>;

const componentsMap: { [key: string]: () => JSX.Element } = {
  dashboard: Dashboard,
  clients: Clients,
  providers: Providers,
  workspaces: Workspaces,
  createspace: CreateWorkspace,
  addcategory: AddCategory,
  payments: Payments,
  support: Support,
  reviews: Reviews,
};

export default function Page({ params }: { params: { slug: string } }) {
  const Component = useMemo(() => componentsMap[params.slug] || (() => <h1>404 Not Found</h1>), [params.slug]);

  return <Component />;
}
