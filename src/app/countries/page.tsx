import CountryGrid from "@/components/countries/CountryGrid";
import { serverApi } from "@/lib/serverApi";

export const metadata = { title: "Country Intelligence - GeoPulse" };

const featuredIsoCodes = ["USA", "IRN", "PAK", "ISR"];

export default async function CountriesPage() {
  const dashboards = await Promise.all(featuredIsoCodes.map((isoCode) => serverApi.getCountryDashboard(isoCode)));

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-6">Country Intelligence</h1>
      <CountryGrid dashboards={dashboards} />
    </div>
  );
}
