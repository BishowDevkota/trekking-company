// import AboutCompany from "@/components/About-page/AboutCompany";
// import ContactForm from "@/components/Contact/ContactForm";
// import Hero from "@/components/Home-page/Hero";
// import OurAdventure from "@/components/Trekking/OurAdventure";

import AboutUs from "@/components/aboutPage/AboutUs";
import Hero from "@/components/homePage/Hero";
import OurTrekking from "@/components/homePage/OurTrekking";

// import RecentBlogs from "@/components/Home-page/RecentBlogs";
export default function HomePage() {
  return (
     <div>
       <Hero/>
       <OurTrekking/>
       <AboutUs/>
      {/*      <ContactForm/>
      <RecentBlogs/> */}
     </div>

  );
}