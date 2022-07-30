import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ProductRow from '../products/ProductRow';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import Image from 'next/image';

class ProductsBanner extends Component {
  render() {
    const { products, t } = this.props;

    return (
      <div className="custom-container py-4 my-4">
        <div className="d-flex flex-column align-items-center mb-4 pb-3">
          <p className="font-color-medium mb-4">
            {t('shop.latestProducts.title')}
          </p>
          <p
            className="text-center font-size-display1 mb-3 font-weight-medium"
            style={{ maxWidth: '32rem' }}
          >
            {t('shop.latestProducts.body')}
          </p>
          <Link href="/collection">
            <a className="d-flex py-2 align-items-center font-color-brand borderbottom border-color-brand700">
              <p className="mr-3">
                {t('shop.latestProducts.more')}
              </p>
              <svg className="fill-brand700 w-24 h-24">
                <title>Right icon</title>
                <use xlinkHref="/icons.svg#arrow-long-right"></use>
              </svg>
            </a>
          </Link>
        </div>
        <ProductRow products={products.slice(0, 4)} />
      </div>
    );
  }
}

ProductsBanner.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};

ProductsBanner.defaultProps = {
  products: [],
};

export default connect(state => state)(withTranslation()(ProductsBanner));
