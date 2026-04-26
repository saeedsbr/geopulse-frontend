import { notFound } from "next/navigation";
import CountryDashboard from "@/components/countries/CountryDashboard";
import { serverApi } from "@/lib/serverApi";

export default async function CountryDashboardPage({ params }: { params: { isoCode: string } }) {
  try {
    const dashboard = await serverApi.getCountryDashboard(params.isoCode);
    return <CountryDashboard dashboard={dashboard} />;
  } catch {
    notFound();
  }
}
