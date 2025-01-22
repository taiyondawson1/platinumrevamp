import AccountMetrics from "@/components/AccountMetrics";
import StatsGrid from "@/components/StatsGrid";

const ExpertAdvisorsPage = () => {
  return (
    <main className="flex-1 p-8 max-w-[1400px] mx-auto ml-16">
      <div className="space-y-8">
        <AccountMetrics />
        <StatsGrid />
      </div>
    </main>
  );
};

export default ExpertAdvisorsPage;