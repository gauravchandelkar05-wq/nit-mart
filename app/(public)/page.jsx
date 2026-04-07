import Hero from "@/components/Hero";
import OurSpecs from "@/components/OurSpec";
import BestSelling from "@/components/BestSelling";
import LatestProducts from "@/components/LatestProducts";
import HowItWorks from "@/components/HowItWorks";
import SellerCTA from "@/components/SellerCTA";

export default function Page() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <Hero />
      <BestSelling />
      <HowItWorks /> 
      <LatestProducts />
      <OurSpecs /> 
      
      <SellerCTA />
    </div>
  );
}