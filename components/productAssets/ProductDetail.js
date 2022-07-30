import React, { useState, useEffect, useRef, useMemo } from 'react';
import VariantSelector from '../productAssets/VariantSelector';
import { connect, useDispatch } from 'react-redux';
import { addToCart } from '../../store/actions/cartActions';
import { useTranslation } from 'react-i18next';
import { useAvailability } from '../../lib/useAvailability.js';
import { usePrevious } from '../../lib/usePrevious.js';



/**
 * @typedef {{
 *  available: number,
 *  managed: boolean,
 * }} Inventory
 */

/**
 * @typedef {{
 *  product: {
 *    id: string,
 *    variant_groups: {
 *      id: string,
 *      options: {
 *        id: string,
 *        price: {
 *          raw: number,
 *        },
 *      }[],
 *    }[],
 *    price: {
 *      raw: number,
 *      formatted_with_code: string,
 *    },
 *    name: string,
 *    description: string,
 *    permalink: string,
 *    is: {
 *      sold_out: boolean,
 *    },
 *    inventory: Inventory,
 *  },
 * }} ProductProps
 */

/**
 * @param {ProductProps} props 
 * @returns JSX.Element
 */
function ProductDetail({
  product: {
    id: productId,
    name,
    description,
    permalink,
    price: {
      raw: priceRaw,
      formatted_with_code: priceFormattedWithCode
    },
    variant_groups: variantGroups,
    inventory,
  }
}) {
  const [ selectedOptions, setSelectedOptions ] = useState({});
  const [ loading, setLoading ] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { left, inCart } = useAvailability(productId, permalink);
  const prevProductId = usePrevious(productId);

  useEffect(() => {
    if (!prevProductId || prevProductId !== productId) {
      // Product was changed, reset selected variant group options
      setSelectedOptions({
        // Assign the first option as the selected value for each variant
        ...variantGroups.reduce((acc, variantGroup) => ({
          ...acc,
          [variantGroup.id]: variantGroup.options[0].id,
        }), {}),
      });
    }
  }, [prevProductId, productId, variantGroups]);

  const handleSelectOption = (variantGroupId, optionId) => {
    setSelectedOptions({
      ...selectedOptions,
      [variantGroupId]: optionId,
    });
  }

  const price = useMemo(() => {
    if (!selectedOptions || typeof selectedOptions !== 'object') {
      return priceRaw;
    }

    const options = Object.entries(selectedOptions);

    const value = priceRaw + options.reduce((acc, [variantGroup, option]) => {
      const variantDetail = variantGroups.find(candidate => candidate.id === variantGroup);
      if (!variantDetail) {
        return acc;
      }
      const optionDetail = variantDetail.options.find(candidate => candidate.id === option);
      if (!optionDetail) {
        return acc;
      }

      return acc + optionDetail.price.raw;
    }, 0);

    return value.toFixed(2);
  }, [priceRaw, selectedOptions, variantGroups]);

  const priceSymbol = useMemo(() => 
    priceFormattedWithCode.split(' ').pop(),
    [priceFormattedWithCode]
  );

  const soldOut = useMemo(() =>
    left - inCart <= 0,
    [left, inCart]
  );

  const handleAddToCart = () => {
    setLoading(true);

    dispatch(addToCart(productId, 1, selectedOptions))
      // @ts-ignore
      .then(() => setLoading(false))
      .catch((error) => {
        setLoading(false);

        console.log('Cannot add product to cart', error);
        alert(t('error.addProductToCart'));
      });
  }

  return (
    <div>
      {/* Product Summary */}
      <p className="font-size-title font-family-secondary mt-2 mb-2">
        {name}
      </p>

      <div
        className="mb-4 pb-3 font-size-paragraph"
        dangerouslySetInnerHTML={{
          __html: description
        }}
      />

      {/* Product Variant */}
      <div className="d-sm-block">
        <VariantSelector
          className="mb-3"
          variantGroups={variantGroups}
          onSelectOption={handleSelectOption}
          selectedOptions={selectedOptions}
        />
      </div>

      {/* Add to Cart & Price */}
      <div className="d-flex pb-2">
        <button
          onClick={handleAddToCart}
          disabled={soldOut}
          className={`h-56 bg-brand700 font-color-white pl-3 pr-4 d-flex align-items-center flex-grow-1 ${loading ? 'spinner' : ''}`}
          type="button"
        >
          <span className="flex-grow-1 text-center">
            { soldOut ? t('shop.soldOut') : t('shop.addToCart') }
          </span>
          <span className="border-left border-color-white pl-3 ml-3">
          { price } { priceSymbol }
          </span>
        </button>
      </div>

      {/* Quantity selected and left */}
      <p className="d-flex justify-content-between">
        <span className="font-color-success">
          {inCart > 0 && t('shop.inCart', { count: inCart })}
        </span>
        <span className="font-color-medium">
          {left > inCart && t('shop.left', { count: left - inCart })}
        </span>
      </p>
    </div>
  );
}

export default connect(state => state)(ProductDetail);
