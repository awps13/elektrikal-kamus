import KamusClient from "./KamusClient";
import { requireUser } from "../lib/dal";

export default async function KamusPage() {
  const user = await requireUser();
  return <KamusClient user={{ name: user.name, role: user.role }} />;
}
