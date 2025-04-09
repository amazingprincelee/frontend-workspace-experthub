import React from 'react';

const StatCard = ({ img, title, count, bg }: { img: string, title: string, count: any, bg: string }) => {
  let background = `bg-[${bg}]`
  return (
    <div className={`lg:w-[24%] sm:my-3 rounded-md p-4 bg-[${bg}1C]`} style={{ backgroundColor: bg+'1C' }}>
      <div style={{ backgroundColor: bg }}
        className="p-2 rounded-sm w-10 h-10">
        <img className='w-5 h-5 mx-auto my-auto' src={"/images/icons/" + img + ".svg"} alt="" />
      </div>
      <p className='font-medium text-sm my-2'>{title}</p>
      <p className='font-bold'>{count}</p>
    </div >
  );
};

export default StatCard;