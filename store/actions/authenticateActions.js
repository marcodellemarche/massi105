import commerce from '../../lib/commerce'
import { CLEAR_CUSTOMER, SET_CUSTOMER } from './actionTypes';

/**
 * Fetch the customer information from Commerce.js. If the customer is not
 * logged in yet, an empty promise will be returned.
 */
export const setCustomer = () => async (dispatch) => {
  // First check is customer is logged in and just return out if they're not
  const isLoggedIn = commerce.customer.isLoggedIn();

  if (!isLoggedIn) {
    dispatch({ type: CLEAR_CUSTOMER });
    return Promise.resolve(null);
  }

  const about = await commerce.customer.about()
    .catch(() => {
      // Most likely a 404, meaning the customer doesn't exist. It should be logged out
      commerce.customer.logout();
      dispatch({ type: CLEAR_CUSTOMER });
    });

  if (!about) {
    return Promise.resolve(null);
  }

  dispatch({ type: SET_CUSTOMER, payload: about });

  const { data: orders } = await commerce.customer.getOrders();

  dispatch({ type: SET_CUSTOMER, payload: { ...about, orders } });
}

/**
 * Clear the logged in customer from state, and from Commerce.js.
 */
export const clearCustomer = () => (dispatch) => {
  commerce.customer.logout();
  dispatch({ type: CLEAR_CUSTOMER });
}
