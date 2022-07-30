import { useSelector } from 'react-redux';
import useSWR from 'swr';
import commerce from './commerce.js';

/**
 * @typedef {{
 *  available: number,
 *  managed: boolean,
 * }} Inventory
 */

/** @param {string} permalink */
function fetcher(permalink) {
    if (!permalink) {
      throw new Error('Product permalink is undefined');
    }
  
    return commerce.products.retrieve(permalink, { type: 'permalink '});
};
  
/**
 * Custom hook for getting product availability
 * @param {string} id
 * @param {string} permalink
 * @returns product availability
 */
export function useAvailability(id, permalink) {
    const { data, error } = useSWR(permalink, fetcher, { refreshInterval: 30 });
    
    /** @constant @type {number} */
    const inCart = useSelector((state) => state?.cart?.line_items?.find(item => item?.product_id === id)?.quantity || 0);
  
    /** @constant @type {Inventory} */
    const defaultInventory = useSelector((state) => state?.products?.find(product => product?.id === id)?.inventory);
  
    if (error) {
      console.error('Error fetching product availability for product', id, permalink, error);
      return { left: 0, inCart };
    }
  
    if (!data) {
      if (defaultInventory) {
        const left = defaultInventory.managed ? defaultInventory.available : 10;

        return { left, inCart };
      }
  
      // console.error('Error fetching product availability, data is undefined for product:', id, permalink);
      // return { left: 0, inCart };
    }
  
    const inventory = data ? data.inventory : { managed: false, available: 10 };
    const left = inventory.managed ? inventory.available : 10;
  
    return { left, inCart };
}