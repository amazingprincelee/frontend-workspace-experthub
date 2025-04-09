import apiService from '@/utils/apiService';
import React, { useState } from 'react';

const Scoring = ({ open, handleClick, data, questions }: { open: boolean, handleClick: any, data: any, questions: any }) => {
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(false)

  const sendScore = async () => {
    setLoading(true)
    await apiService.post('assessment/set-score', {
      score,
      assessmentId: questions._id,
      userId: data.student._id
    }).then(function (response) {
      console.log(response.data)
      claimCertificate()
      handleClick()
      setLoading(false)
    })
  }

  const claimCertificate = async () => {
    try {
      await apiService.post("certificate/claim", {
        user: data.student._id,
        title: questions.title,
        tutor: questions.tutor,
      }).then(function (response) {
        console.log(response.data)
      })
      // alert("Certificate claimed successfully!");
      // router.back()
    } catch (error) {
      // setShowGradeModal(false)
      console.error("Error claiming certificate:", error);
    }
  };
  return (
    open ? <div>
      <div onClick={() => handleClick()} className='fixed cursor-pointer bg-[#000000] opacity-50 top-0 left-0 right-0 w-full h-[100vh] z-10'></div>
      <div className='fixed top-10 bottom-10 left-0 overflow-y-auto rounded-md right-0 lg:w-[70%] w-[95%] mx-auto z-20 bg-[#F8F7F4]'>
        <div className='shadow-[0px_1px_2.799999952316284px_0px_#1E1E1E38] p-4 lg:px-12 flex justify-between'>
          <p className='font-medium'>Scoring</p>
          <img onClick={() => handleClick()} className='w-6 h-6 cursor-pointer' src="/images/icons/material-symbols_cancel-outline.svg" alt="" />
        </div>
        <div className='p-4'>
          {questions.assesment.map((question: any, index: any) => <div key={question._id} className='my-3 text-lg'>
            <p><strong>Question:</strong>{question.question}</p>
            <p><strong>Answer:</strong>{data.answers[index].answer}</p>
          </div>)}
          <div className='mt-4'>
            <input onChange={(e) => setScore(parseInt(e.target.value))} value={score} type="number" className='w-full p-3 border rounded-md' placeholder='Score (0/100)' />
            <button onClick={() => sendScore()} className='bg-primary p-3 mt-3'>{loading ? 'loading...' : 'Send Score'}</button>
          </div>
        </div>
      </div>
    </div>
      : null
  );
};

export default Scoring;