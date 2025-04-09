import React from 'react';

const ImageViewer = ({ image, control }: { image: any, control?: boolean }) => {
  return (
    <div>
      {image?.type === 'image' ? <img className='w-full object-cover h-80' src={image?.url} alt="" />
        : image.type === 'video' ? <video
          src={image?.url}
          width="500"
          autoPlay muted
          controls={control}
          className="embed-responsive-item w-full object-cover h-full"
        >
          <source src={image?.url} type="video/mp4" />
        </video> :
          <img className={control ? 'w-full object-cover h-80' : 'w-full object-cover rounded-md h-44'} src={image} alt="" />}
    </div>
  );
};

export default ImageViewer;