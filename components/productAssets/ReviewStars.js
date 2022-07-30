import React from 'react';
import Image from 'next/image';

export default function ReviewStars({ count }) {
  return (
    <div className="d-flex">
      <div className="d-flex position-relative">
        {[1, 2, 3, 4, 5].map(index => (
          <svg
            className="fill-black w-16 h-16"
            key={index}
          >
            <title>Review star</title>
            <use xlinkHref="/icons.svg#star"></use>
          </svg>
        ))}
        <div
          className="d-flex position-absolute left-0 top-0 right-0 bottom-0 overflow-hidden"
          style={{ flexWrap: 'nowrap', width: `${count * 20}%` }}
        >
          {[1, 2, 3, 4, 5].map(index => (
            <svg
              className="fill-black w-16 h-16 d-block"
              key={index}
            >
              <title>Review star solid</title>
              <use xlinkHref="/icons.svg#star-solid"></use>
            </svg>
          ))}
        </div>
      </div>
      <span className="ml-2 font-size-caption font-weight-semibold">
        {count}/5
      </span>
    </div>
  );
}
