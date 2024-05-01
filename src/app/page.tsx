import { StripePricingTable } from "@/components/table-price";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex items-center justify-center">
      <StripePricingTable />
      <Link
        href="sign-in"
        className="bg-violet-500 text-white text-2xl p-8 rounded-full"
      >
        login
      </Link>
    </div>
  );
};

export default HomePage;
