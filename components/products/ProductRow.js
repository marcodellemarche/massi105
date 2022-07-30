import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ProductCard from '../products/ProductCard';

class ProductRow extends Component {
  render() {
    const { products } = this.props;
    const reg = /(<([^>]+)>)/ig;

    return (
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-6 col-sm-6 col-lg-3">
            <ProductCard
              permalink={product.permalink}
              image={product.media.source}
              name={product.name}
              price={product.price.formatted_with_code}
              description={product.description && product.description.replace(reg, '')}
              soldOut={product.is.sold_out}
              quantity={product.inventory.managed ? product.inventory.available : Infinity}
            />
          </div>
        ))}
      </div>
    );
  }
}

ProductRow.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object),
};

ProductRow.defaultProps = {
  products: [],
};

export default ProductRow;
