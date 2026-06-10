import ModulClient from "./ModulClient";
import { getCurrentUser } from "../lib/dal";

export default async function ModulPage() {
  const user = await getCurrentUser();
  return <ModulClient user={user ? { name: user.name, role: user.role } : null} />;
}
