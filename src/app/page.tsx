"use client"

import Hero from "@/components/hero/hero";
import Advantages from "@/components/advantage-component/advantage";
import WorkspaceSlider from "@/components/workspace/workspace-slider";
import HybridWorkspace from "@/components/workspace/hybrid-workspace";
import ReadyToCustomize from "@/components/workspace/ready-to-customize";
import OnlineWorkspace from "@/components/workspace/online-workspace";
import FindAPerfect from "@/components/workspace/find-a-perfect";
import PerfectMembership from "@/components/workspace/perfect-membership";

export default function Home() {
 

  return (
   <div>
      <main className="landing">
        <Hero />
        <Advantages />
      <WorkspaceSlider />
      <HybridWorkspace />
      <FindAPerfect />
      <OnlineWorkspace />
      <PerfectMembership />
      <ReadyToCustomize />
       
        
        
      </main>
     
      </div>
  )
}
