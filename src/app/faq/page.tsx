'use client';

import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
  {
    question: 'What are the operating hours?',
    answer: 'Our workspace is open from Monday to Friday for registered members. Day visitors can access the space from 8 AM to 4 PM.',
  },
  {
    question: 'Do you offer high-speed internet?',
    answer: 'Yes! We provide high-speed fiber-optic internet to ensure seamless connectivity for all users.',
  },
  {
    question: 'Are there private offices available?',
    answer: 'Yes, we have dedicated private offices for individuals and teams. Contact us for availability and pricing.',
  },
  {
    question: 'Can I book a meeting room?',
    answer: 'Absolutely! Our meeting rooms are available for booking on an hourly or daily basis.',
  },
  {
    question: 'Is there a membership plan?',
    answer: 'We offer flexible membership plans including daily, weekly, and monthly options to suit different needs.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='max-w-3xl mx-auto p-6 mt-28'>
      <h2 className='text-2xl font-bold text-center mb-6'>Frequently Asked Questions</h2>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <div key={index} className='border rounded-lg p-4 bg-gray-100'>
            <button
              className='flex justify-between items-center w-full text-left'
              onClick={() => toggleFAQ(index)}
            >
              <span className='font-semibold'>{faq.question}</span>
              {openIndex === index ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            {openIndex === index && <p className='mt-2 text-gray-700'>{faq.answer}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
