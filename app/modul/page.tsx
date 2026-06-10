import ModulClient from "./ModulClient";
import { requireUser } from "../lib/dal";

export default async function ModulPage() {
  const user = await requireUser();
  return <ModulClient user={{ name: user.name, role: user.role }} />;
}
