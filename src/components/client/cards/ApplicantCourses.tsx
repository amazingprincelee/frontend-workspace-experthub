import React, { useState } from 'react';
import CourseDetails from '../modals/CourseDetails';
import { CourseType } from '@/types/CourseType';
import Link from 'next/link';
import ImageViewer from '@/components/ImageViewer';
import AppointmentModal from '../modals/AppointmentModal';
import { useRouter } from 'next/navigation';
import { Dropdown, MenuProps, Progress } from 'antd';
import { useAuth } from "@/context/AuthContext";
import apiService from '@/utils/apiService';
import PaymentModal from '../modals/PaymentModal'
import { notification } from 'antd';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

const ApplicantCourses = ({ course }: { course: CourseType }) => {
  const [open, setOpen] = useState(false)
  const [appointment, setAppointment] = useState(false)
  const router = useRouter()
   const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: (
        <p onClick={() => setAppointment(true)} >Appointment</p>
      ),
    },
    {
      key: '2',
      label: (
        <p onClick={() => router.push(`/applicant/message?id=${course.instructorId}`)} >Send Message</p>
      ),
    },
  ]
  const enrolee = course.enrollments?.filter((single: { user: any; }) => single.user === user.id)
  // console.log(course)
  // console.log(hasTimeElapsed(enrolee[0]?.enrolledOn, course.timeframe?.value, course.timeframe?.unit))

  if (course.timeframe) {
    if (hasTimeElapsed(enrolee[0]?.enrolledOn, course.timeframe?.value, course.timeframe?.unit) && enrolee[0].status === 'active') {
      apiService.put(`/update-status/${course.id}`, {
        id: user.id
      }).then(function (response) {
        console.log(response.data)
      }).catch(e => {
        console.log(e);
      })
    }
  }

  const renew = () => {
    apiService.get(`courses/renew/${course._id}/${user.id}`)
      .then(function (response) {
        console.log(response.data)
        api.open({
          message: "Course Renewed Successfully!"
        });
        setTimeout(() => {
          router.refresh();
        }, 5000)
      }).catch(err => {
        console.log(err)
      })
  }

  const payWithWallet = () => {
    apiService.post(`transactions/pay-with`, {
      amount: course.fee,
      userId: user.id
    })
      .then(function (response) {
        console.log(response.data)
        api.open({
          message: response.data.message
        });
        if (response.status == 200) {
          renew()
          setIsModalOpen(false)
        }
      })
      .catch(err => {
        setIsModalOpen(false)
        console.log(err)
        // handleClick()
        api.open({
          message: err.response.data,
          placement: 'top'
        });
      })
  }

  const config: any = {
    public_key: 'FLWPUBK-56b564d97f4bfe75b37c3f180b6468d5-X',
    tx_ref: Date.now(),
    amount: course.fee,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user.email,
      // phone_number: '070********',
      name: user.fullName,
    },
  };

  const handleFlutterPayment = useFlutterwave(config);


  return (
    <div className="lg:w-[32%] w-full my-3">
      <div className="bg-white p-2 rounded-md">
        <div className="flex my-2">
          <img className="w-6 h-6 rounded-full" src={course.instructorImage || "/images/user.png"} alt="" />
          <p className="font-medium ml-3 text-sm">A course by {course.instructorName}</p>
        </div>
        <Link href={course.timeframe && hasTimeElapsed(enrolee[0]?.enrolledOn, course.timeframe?.value, course.timeframe?.unit) ? '' : `/applicant/${course._id}?page=${course.type}`}>
          <ImageViewer image={course.thumbnail} />
        </Link>
        <div className="p-2">
          <h3 className="font-medium text-xl my-2">
            {course.title}
            {course.timeframe && hasTimeElapsed(enrolee[0]?.enrolledOn, course.timeframe?.value, course.timeframe?.unit) ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#FF0000] text-white text-sm rounded-md px-4 py-1"
              >
                Renew
              </button>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className="text-sm px-4 bg-primary p-1 rounded-md"
              >
                {course.type === "online" ? "Join Live" : course.type}
              </button>
            )}
          </h3>
          <p className="text-xs">{course.about.substring(0, 70)}...</p>
        </div>
      </div>

      <AppointmentModal open={appointment} handleClick={() => setAppointment(false)} to={course.instructorId} />
      <CourseDetails course={course} open={open} action={"Course"} call={null} type='view' handleClick={() => setOpen(false)} />

      <PaymentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} wallet={() => payWithWallet()} card={() => handleFlutterPayment({
        callback: (response) => {
          renew()
          setIsModalOpen(false)
          console.log(response)
          closePaymentModal() // this will close the modal programmatically
        },
        onClose: () => {
          console.log("closed")
        },
      })} />
    </div>
  );
};

export default ApplicantCourses;

function hasTimeElapsed(enrolledOn: any, value: any, unit: any): any {

  if (!enrolledOn && !value && !unit) {
    return false
  }
  const start = new Date(enrolledOn);
  const now = new Date();

  // Calculate the target date by adding the specified timeframe to the start date
  let targetDate;
  switch (unit) {
    case 'days':
      targetDate = new Date(start.setDate(start.getDate() + value));
      break;
    case 'weeks':
      targetDate = new Date(start.setDate(start.getDate() + value * 7));
      break;
    case 'months':
      targetDate = new Date(start.setMonth(start.getMonth() + value));
      break;
    default:
      throw new Error("Invalid unit. Use 'days', 'weeks', or 'months'.");
  }

  // Check if the current date has passed the target date
  return now >= targetDate;
}
