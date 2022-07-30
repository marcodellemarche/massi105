import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

/**
 * 
 * @param {{
 *  permalink: string,
 *  image: string,
 *  name: string,
 *  description: string,
 *  price: number,
 *  soldOut: boolean,
 *  quantity: number,
 * }} props 
 * @returns JSX.Element
 */
export default function ProductCard({
  permalink,
  image,
  name,
  description,
  price,
  soldOut,
  quantity,
}) {
  const { t } = useTranslation();

  return (
    <Link href="/product/[permalink]" as={`/product/${permalink}`}>
      <a className="mb-5 d-block font-color-black cursor-pointer">
        <div
          className="mb-3 product-card--image-container"
          style={{
            background: `#0000000d url("${image}") center center/contain no-repeat`,
          }}
        >
          {soldOut && <div className="product-card--overlay-text">
            {t('shop.soldOut').toUpperCase()}
          </div>}
        </div>
        <p className="font-size-subheader mb-2 font-weight-medium product-card--name">
          {name}
        </p>
        {/* <p className="mb-2 font-color-medium">{description}</p> */}
        <p className="font-size-title font-weight-bold pb-2 borderbottom border-color-black">
          {price}
        </p>
      </a>
    </Link>
  );
}
