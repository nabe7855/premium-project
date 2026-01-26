import PopBenefitsSection from '@/components/recruit2/sections/pop-campaign/PopBenefitsSection';
import PopCampaignHero from '@/components/recruit2/sections/pop-campaign/PopCampaignHero';
import PopClosingCTA from '@/components/recruit2/sections/pop-campaign/PopClosingCTA';
import PopProblemSection from '@/components/recruit2/sections/pop-campaign/PopProblemSection';
import PopSolutionSection from '@/components/recruit2/sections/pop-campaign/PopSolutionSection';
import PopZeroRiskPledge from '@/components/recruit2/sections/pop-campaign/PopZeroRiskPledge';

export default function Test9Page() {
  return (
    <main className="min-h-screen">
      <PopCampaignHero />
      <PopProblemSection />
      <PopSolutionSection />
      <PopBenefitsSection />
      <PopZeroRiskPledge />
      <PopClosingCTA />
    </main>
  );
}
