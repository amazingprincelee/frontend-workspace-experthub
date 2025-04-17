"use client";

import ApplicantCourses from "@/components/client/cards/ApplicantCourses";
import RecommendedCard from "@/components/client/cards/RecommendedCard";
import StatCard from "@/components/client/cards/StatCard";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { WorkspaceType } from "@/types/WorkspaceType";
import { AssesmentType } from "@/types/AssesmentType";
import Link from "next/link";
import apiService from "@/utils/apiService";
import AddCourseInterests from "@/components/client/modals/AddCourseInterests";

const ClientDashboard = () => {
  const { user, loading: authLoading } = useAuth(); 
  const [recommended, setRecommended] = useState<WorkspaceType | []>([]);
  const [workspaces, setWorkspaces] = useState<WorkspaceType[]>([]);
  const [view, setView] = useState(3);
  const [provider, setprovider] = useState([]);
  const [active, setActive] = useState("");
  const [assessments, setAssessment] = useState<AssesmentType | []>([]);
  const [open, setOpen] = useState(false);

  const getAssessment = async () => {
    await apiService
      .get(`assessment/my-assessment/${user?.id}`)
      .then(function (response) {
        setAssessment(response.data.myAssesment.reverse());
      })
      .catch((e) => {
        setAssessment([]);
      });
  };

  const getRecommended = async () => {
    await apiService
      .get(`workspace/recommended`)
      .then(function (response) {
      
        console.log("recommeded workspace fetched", response.data.workspace );
        
        
       setRecommended(response.data.workspace);
      })
      .catch((e) => {
        setRecommended([]);
      });
  };


  const getWorkspaces = async () => {
    await apiService
      .get(`workspace/enrolled-workspaces/${user?.id}`)
      .then(function (response) {
        setWorkspaces(response.data.enrolledWorkspaces);
        console.log(response.data.enrolledWorkspaces);
      })
      .catch((e) => {
        setWorkspaces([]);
      });
  };

 

  const getProvider = () => {
    if (!user?._id) return;
  
    apiService
      .get(`myproviders/${user._id}`)
      .then((response) => {
        setprovider(response.data.providers); 
      })
      .catch((error) => {
        console.error("Error fetching providers:", error);
        setprovider([]); 
      });
  };
  

  useEffect(() => {
    if (!user || authLoading) return; 
    getRecommended();
    getWorkspaces();
    getProvider();
    getAssessment();
  }, [user, authLoading]);

  
  if (authLoading || !user) {
    return <div className="text-center p-6">Loading...</div>;
  }

  return (
    <div>
      <section className="p-4 lg:flex hidden justify-between">
        <StatCard title="Total No of Workspaces" count={workspaces.length} bg="#27C2D6" img="clock-line" />
        <StatCard title="Assessments" count={assessments.length} bg="#DC9F08" img="ic_outline-assessment" />
        <StatCard title="Progress" count={"0%"} bg="#53C48C" img="game-icons_progression" />
        <StatCard title="Workspace Providers" count={provider.length} bg="#7E34C9" img="ph_chalkboard-teacher" />
      </section>
      <section className="m-3 p-3 rounded-md shadow-[0px_2px_4px_0px_#1E1E1E21]">
        <div className="text-sm flex justify-between">
          <div className="">
            <div className="flex">
              <h4 className="text-lg my-auto mr-6 font-medium">Check out available workspace</h4>
              <button onClick={() => setOpen(true)} className="bg-primary p-3 rounded-md">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-plus"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
              </button>
            </div>
            <div className="!flex w-full flex-wrap">
              <p onClick={() => setActive("")} className="m-2 bg-gray cursor-pointer px-2 text-base">
                All
              </p>
              {user.assignedCourse && (
                <p
                  onClick={() => setActive(user.assignedCourse)}
                  className="m-2 bg-gray px-2 cursor-pointer text-base"
                >
                  {user.assignedCourse}
                </p>
              )}
              {user.otherCourse?.map((single: string, index: any) =>
                single.length === 0 ? null : (
                  <p
                    key={index}
                    onClick={() => setActive(single)}
                    className="m-2 bg-gray cursor-pointer px-2 text-base"
                  >
                    {single}
                  </p>
                )
              )}
            </div>
          </div>
          <p
            onClick={() => setView(view === 3 ? workspaces.length : 3)}
            className="text-[#DC9F08] cursor-pointer mt-auto"
          >
            VIEW {view === 3 ? "ALL" : "LESS"}
          </p>
        </div>
        <div className="flex flex-wrap justify-between">
          {workspaces
            .slice(0, view)
            .filter((course: WorkspaceType) => course.category === active || active === "")
            .map((course: WorkspaceType) => (
              <ApplicantCourses key={course._id} course={course} />
            ))}
        </div>
      </section>
      <section className="m-4">
        <p className="text-xl font-medium my-3">Application status</p>
        <p className="text-sm">
          You are a part of our Workspace Community.
          <br /> <br />
          You can begin your journey with some introductory workspaces in your area. Enjoy your journey to
          becoming one of our valueble clients.
        </p>
      </section>
      <section className="m-2 p-3 shadow-md">
        <div className="text-sm my-3 flex justify-between">
          <p className="font-bold text-base">Recommended for you</p>
          <Link href={"/applicant/feeds"}>
            <p className="text-sm">Other Workspaces</p>
          </Link>
          <p className="text-[#DC9F08] text-sm">VIEW ALL</p>
        </div>
        <div className="flex flex-wrap justify-between">
          {recommended.length === 0 ? (
            <div>No recommended workspaces</div>
          ) : (
            recommended
              .filter((workspace: WorkspaceType) => workspace.category === active || active === "")
              .map((workspace: any) => (
                <RecommendedCard key={workspace._id} workspace={workspace} call={() => getWorkspaces()} />
              ))
          )}
        </div>
        <AddCourseInterests open={open} handleClick={() => setOpen(false)} />
      </section>
    </div>
  );
};

export default ClientDashboard;