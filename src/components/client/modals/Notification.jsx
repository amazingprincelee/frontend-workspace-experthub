import { useAppSelector } from '@/store/hooks';
import React, { useEffect, useState } from 'react'
import Popover from '@mui/material/Popover';
import Link from 'next/link';
import Image from 'next/image';
import CourseDetails from './CourseDetails';
import apiService from '@/utils/apiService';
export function formatDate(date) {
    var now = new Date();
    var difference = now - date;
    var differenceInSeconds = Math.floor(difference / 1000);
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    if (differenceInSeconds < 60) {
        return differenceInSeconds + "s ago";
    }
    if (differenceInSeconds < 3600) {
        var minutes = Math.floor(differenceInSeconds / 60);
        return minutes + "min ago";
    }
    if (differenceInSeconds < 86400) {
        var hours = Math.floor(differenceInSeconds / 3600);
        return `${hours}${hours === 1 ? "hr" : "hrs"} ago`;
    }
    if (differenceInSeconds < 604800) {
        var days = Math.floor(differenceInSeconds / 86400);
        if (days === 1) {
            return `Yesterday, ${hours}:${(minutes < 10 ? '0' : '')}${minutes}  ${ampm}`;
        } else {
            return `${days} days ago, ${hours}:${(minutes < 10 ? '0' : '')}${minutes}  ${ampm}`;
        }
    }
    var day = date.getDate();
    var month = date.toLocaleString('default', { month: 'long' });

    return `${day} ${month}, ${hours}:${(minutes < 10 ? '0' : '')}${minutes}  ${ampm}`;;
}
export default function Notifications() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [notifications, setNotifications] = useState()
    const [course, setCourse] = useState({})
    const [openDet, setOpenDet] = useState(false)
    const [action, setAction] = useState("Course")
    const user = useAppSelector((state) => state.value);
    useEffect(() => {
        if (!notifications) {
            getNotifcations()
        }
    })

    const getNotifcations = () => {

        try {
            apiService.get(`notifications/all/${user?.id}`)
                .then(function (response) {
                    // console.log(response.data);
                    setNotifications(response.data)
                })
        } catch (e) {
            console.log(e)

        }
    }
    const markAsRead = (id) => {

        try {
            apiService.get(`notifications/mark-as-read/${id}`)
                .then(function (response) {
                    console.log(response.data);
                    getNotifcations()
                })
        } catch (e) {
            console.log(e)

        }
    }

    const openCourseDetail = (course) => {
        setCourse(course)

        setAnchorEl(null);
        setOpenDet(true)


    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return (
        <>
            <button aria-describedby={id} className="text-[20px] rounded-full px-4 relative" onClick={handleClick}>
                <img src="/images/icons/notification.svg" className='w-[20px] h-[20px]' alt="" />
                {
                    notifications?.filter(data => !data.read).length > 0 && <div className='absolute text-white text-[11px] top-2 right-2 flex items-center justify-center w-[15px] h-[15px] rounded-full bg-red-500'>{notifications?.filter(data => !data.read).length || 0}</div>
                }

            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{
                    "&& .MuiPaper-rounded.MuiPaper-elevation8.MuiPopover-paper": {
                        borderRadius: "6px !important"
                    }
                }}
            >
                <div className="mt-2 bg-white  xs:w-[250px] sm:w-[350px] h-[80vh] mainer overflow-y-auto  md:w-[600px] rounded-[15px]  shadow-[0px_0px_14px_6px_#E2E2E240]">
                    <div className="flex items-center p-3 border-b border-[#d9d9d9]">
                        <h2 className="font-bold text-[18px]">Notifications</h2>
                    </div>
                    <div className="flex flex-col ">
                        {
                            (notifications && notifications?.length !== 0) ? notifications?.map(data => <div key={data._id} className={`border-b flex flex-row sm:flex-col items-center   px-3 py-6 gap-4 border-[#d9d9d9] ${!data.read ? "bg-[#f5f5f5]" : ""}`}>

                                <Image src={data?.userId.profilePicture || "/images/user.png"} width={100} height={100} className='w-[50px] object-cover object-center h-[50px] mr-auto border border-[#adadad] rounded-full' alt="tester" />
                                <div className="text-darktext text-left flex-1 gap-2">
                                    <span>{data.content} </span>
                                    <Link onClick={(e) => {
                                        if (data.contentType === "course" && data.contentInfo) {
                                            e.preventDefault()
                                            if (data.title.startsWith("Event")) {
                                                setAction("Event")
                                            }
                                            openCourseDetail(data.contentInfo)
                                        }
                                        markAsRead(data._id)
                                        setAnchorEl(null)

                                    }} href={data.title === 'Appointment Booked' ? user.role === "student" ? "/applicant/appointment" : `/${user.role}/appointment` : data.title === 'Message' ? user.role === "student" ? "/applicant/message" : `/${user.role}/message` : data.contentType !== "course" ? "/applicant/test/" + data.contentId : data.title === "Course assigned" ? user.role === "student" ? "/applicant" : "/courses" : data.title.endsWith("live") && data.contentInfo ? "/join-live" : user.role === "student" ? "/applicant" : `/${user.role}/courses`} className='text-primary'>
                                        {data.title === "Course live" ? "Join Live" : "View"}
                                    </Link>
                                </div>


                                <span className=" text-right text-[#adadad]">{formatDate(new Date(data.createdAt))}</span>




                            </div>) : <div className="text-[#adadad] text-center block w-full py-3">No notifications</div>
                        }  </div>
                </div>
            </Popover>
            <CourseDetails course={course} open={openDet} action={action} call={null} type='view' handleClick={() => setOpenDet(false)} />

        </>
    );
}

