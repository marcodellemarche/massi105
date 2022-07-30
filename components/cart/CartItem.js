import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { connect, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItem } from '../../store/actions/cartActions';
import Image from 'next/image';
import Link from 'next/link';

/**
 * @typedef {{
 *  item: {
 *    id: string,
 *    permalink: string,
 *    media: {
 *      source: string,
 *    },
 *    product_name: string,
 *    name: string,
 *    line_total: {
 *      raw: number,
 *      formatted_with_code: string,
 *    },
 *    selected_options: {
 *      group_name: string,
 *      option_name: string,
 *    }[],
 *    quantity: number,
 *  },
 *  closeDrawer: () => void,
 * }} CartItemProps
 */

/**
 * @param {CartItemProps} props 
 * @returns JSX.Element
 */
function CartItem({ item, closeDrawer }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const inventory = useSelector((state) => state?.products?.find(product => product?.id === item.product_id)?.inventory);

  /** @constant @type {number} */
  const left = inventory?.managed ? inventory.available : 10;

  /**
   * Update cart item
   */
  const handleUpdateCartItem = (lineItem, quantity) => {
    dispatch(updateCartItem(lineItem, quantity));
  }

  /**
   * Remove item from cart
   */
  const handleRemoveFromCart = (lineItem) => {
    dispatch(removeFromCart(lineItem));
  }

  return (
    <div className="px-4 px-md-5 mb-2">
      <div className="cart-item d-flex">
        {item.media && (
           <Link href={`/product/${item.permalink}`}>
            <a 
              onClick={() => closeDrawer()}
              className="cursor-pointer"
            >
              <Image
                src={item.media.source}
                className="mr-2"
                alt={item.product_name}
                width={128}
                height={128}
                objectFit='contain'
              />
            </a>
          </Link>
        )}
        <div className="flex-grow-1 borderbottom border-color-gray400 h-100">
          <div className="d-flex justify-content-between mb-2">
            <Link href={`/product/${item.permalink}`}>
              <a
                onClick={() => closeDrawer()}
                className="font-color-black cursor-pointer"
              >
                <p className="flex-grow-1 flex-shrink-1">{item.name}</p>
              </a>
            </Link>
            <p className="text-right font-weight-medium flex-shrink-0 ml-2">
              {item.line_total.formatted_with_code}
            </p>
          </div>
          <div className="d-flex justify-content-between mb-2">
            {item.selected_options.map((option, i) =>
              <p key={i} className="font-color-light font-weight-small">
                {option.group_name}: {option.option_name}
              </p>
            )}
          </div>
          <div className="d-flex align-items-center justify-content-between pt-2 pb-4">
            <div className="d-flex align-items-center">
              <button 
                className="p-0 bg-transparent"
                onClick={() => item.quantity > 1 ? handleUpdateCartItem(item.id, item.quantity -1) : handleRemoveFromCart(item.id)}
              >
                <svg className="fill-black w-16 h-16">
                  <title>Remove item from cart</title>
                  <use xlinkHref="/icons.svg#minus"></use>
                </svg>
              </button>
              <p className="text-center px-3">{item.quantity}</p>
              <button
                className="p-0 bg-transparent"
                onClick={() => item.quantity < left ? handleUpdateCartItem(item.id, item.quantity + 1) : null}
                disabled={item.quantity >= left}
              >
                <svg className="fill-black w-16 h-16">
                  <title>Add item to cart</title>
                  <use xlinkHref="/icons.svg#plus"></use>
                </svg>
              </button>
            </div>
            <p className="text-right text-decoration-underline font-color-medium cursor-pointer" onClick={() => handleRemoveFromCart(item.id)}>
              {t('cart.remove')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(state => state)(CartItem);
