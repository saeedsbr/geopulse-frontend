import WarRoom from "@/components/warroom/WarRoom";
import { serverApi } from "@/lib/serverApi";

export default async function HomePage() {
  const data = await serverApi.getWarRoom();
  return <WarRoom initialData={data} />;
}
