import React, { useState } from 'react';
import { AccordionItem as Item } from '@szhsin/react-accordion';
import CategoryModal from '@/components/modals/CategoryModal';
import apiService from '@/utils/apiService';

const AccordionItem = ({ header, ...rest }) => (
  <Item
    {...rest}
    header={({ state: { isEnter } }) => (
      <>
        <h3 className='text-xl uppercase'>{header}</h3>
        <img
          className={`ml-auto transition-transform duration-200 ease-out ${isEnter && "rotate-180"
            }`}
          src='../../images/icons/chevron-down.svg'
          alt="Chevron"
        />
      </>
    )}
    className="border-b"
    buttonProps={{
      className: ({ isEnter }) =>
        `flex w-full p-4 text-left hover:bg-slate-100 ${isEnter && "bg-slate-200"
        }`
    }}
    contentProps={{
      className: "transition-height duration-200 ease-out"
    }}
    panelProps={{ className: "p-4" }}
  />
);


const Category = ({ category, fetch }) => {
  const [showCategory, setShowCategory] = useState(false)

  const deleteCategory = () => {
    apiService.delete(`category/delete/${category._id}`)
      .then(function (response) {
        fetch()
        console.log(response)
      })
  }

  return (
    <>
      <AccordionItem header={category.category}>
        <div className='flex'>
          <button onClick={() => deleteCategory()} className='p-2 bg-red-400 mr-4 text-white'>Delete</button>
          <button onClick={() => setShowCategory(true)} className='p-2 bg-primary text-white'>Edit</button>
        </div>
        {category.subCategory.length === 0 ? <p>No sub category</p> : <ul>
          {category.subCategory.map((single, index) => <li key={index}>
            {single}
          </li>)}
        </ul>}
      </AccordionItem>
      <CategoryModal fetch={() => fetch()} open={showCategory} category={category} handleClick={() => setShowCategory(false)} />
    </>
  )
};

export default Category;