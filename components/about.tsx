// import AIEngineerIDCard from "@/components/sections/AIEngineerIDCard";

import AIEngineerIDCard from "./AIEngineerIDCard";

export default function AboutPage() {
  return (
    <main>
      <AIEngineerIDCard
  profileImage="/logo.jpg"
  name="Hafiz Muhammad Umar"
  roles={["AI / ML Engineer"]}
  location="Pakistan"
  email="your-real-email@example.com"
  linkedin="https://linkedin.com/in/muhammad-umar-u786/"
/>
    </main>
  );
}