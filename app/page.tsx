import HomeClient from "./HomeClient";
import { getCurrentUser } from "./lib/dal";

export default async function Home() {
  const user = await getCurrentUser();
  return <HomeClient user={user ? { name: user.name, role: user.role } : null} />;
}
