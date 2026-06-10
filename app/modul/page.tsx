import ModulClient from "./ModulClient";
import { requireUser } from "../lib/dal";

export default async function ModulPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const user = await requireUser();
  const { kuis } = await searchParams;
  return (
    <ModulClient
      user={{ name: user.name, role: user.role }}
      initialView={kuis ? "evaluasi" : "cover"}
    />
  );
}
