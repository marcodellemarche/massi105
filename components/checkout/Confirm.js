import React, { Component } from 'react';
import Root from '../../components/common/Root';
import Link from 'next/link';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { withTranslation } from 'react-i18next';
import Image from 'next/image';

class Confirm extends Component {
  constructor(props) {
    super(props);

    this.handlePrint = this.handlePrint.bind(this);
  }

  componentDidMount() {
    if (!this.props.orderReceipt) {
      this.props.router.push('/');
    }
  }

  /**
   * Print the window using the browser's native print functionality, if possible
   */
  handlePrint() {
    if (window && window.print) {
      window.print();
    }
  }

  renderPrintButton() {
    const { t } = this.props;

    if (typeof window === 'undefined') {
      return null;
    }

    return (
      <button
        onClick={this.handlePrint}
        className="d-flex align-items-center text-decoration-underline cursor-pointer mt-3 mt-sm-0 no-print bg-transparent"
      >
        <svg className="fill-black w-20 mr-2 no-print">
          <title>Print receipt</title>
          <use xlinkHref="/icons.svg#print"></use>
        </svg>
        <div className="no-print">
          {t('confirm.printReceipt')}
        </div>
      </button>
    );
  }

  renderSubtotal() {
    const { orderReceipt, t } = this.props;

    return (
      <div className="py-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p>
            {t('confirm.subtotal')}
          </p>
          <p className="text-right font-weight-medium">
            {orderReceipt.order.subtotal.formatted_with_code}
          </p>
        </div>
      </div>
    );
  }

  renderShippingTotal() {
    const { orderReceipt, t } = this.props;

    if (!orderReceipt.order.shipping) {
      return;
    }

    return (
      <div className="pb-3">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <p>
            {t('confirm.shipping')}
          </p>
          <p className="text-right font-weight-medium">
            {orderReceipt.order.shipping.price.formatted_with_code}
          </p>
        </div>
      </div>
    );
  }

  renderTotal() {
    const { orderReceipt, t } = this.props;

    return (
      <div className="d-flex justify-content-between align-items-center mb-2 pt-3 border-top border-color-black">
        <p className="font-size-title font-weight-semibold">
          {t('confirm.orderTotal')}
        </p>
        <p className="text-right font-weight-semibold font-size-title">
          {orderReceipt.order.total.formatted_with_code}
        </p>
      </div>
    );
  }

  render() {
    const { orderReceipt, t } = this.props;

    if (!orderReceipt) {
      return '';
    }

    return (
      <Root>
        <div className="pt-5 mt-2 checkout-confirm receipt">
          {/* Row */}
          <div className="row mt-4">
            <div className="col-12 col-md-10 col-lg-6 offset-md-1 offset-lg-0">
              <div className="h-100 d-flex flex-column align-items-center justify-content-center py-5 px-4 px-sm-5">
                <div className="bg-success700 h-64 w-64 d-flex rounded-circle align-items-center justify-content-center mb-4">
                  <svg className="fill-black w-40 h-40">
                    <title>Confirmation check</title>
                    <use xlinkHref="/icons.svg#check"></use>
                  </svg>
                </div>
                <h3 className="text-center font-family-secondary mb-3">
                  {t('confirm.thanks.title')}
                </h3>
                <h4 className="text-center font-size-subheader mb-3">
                  {t('confirm.thanks.subtitle')}
                </h4>
                <p className="text-center font-color-light mb-5">
                  {t('confirm.orderReference')}: {orderReceipt.customer_reference}
                </p>
                <div className="d-flex w-100 justify-content-center flex-column flex-sm-row">
                  <Link href="/">
                    <a className="checkout-confirm-buttons px-3 py-3 text-center flex-grow-1 border bg-white border-color-gray500 font-color-light mb-2 mb-sm-0 mr-sm-2 no-print">
                      {t('confirm.backHome')}
                    </a>
                  </Link>
                  <Link href="/collection">
                    <a className="checkout-confirm-buttons px-3 py-3 text-center flex-grow-1 bg-black font-color-white no-print">
                      {t('confirm.continue')}
                    </a>
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="bg-brand300 checkout-receipt p-4 p-md-5 overflow-auto">
                <div className="p-sm-4">
                  <div className="border-bottom border-color-gray400 d-flex justify-content-between align-items-start pb-3 flex-column flex-sm-row">
                    <div>
                      <p className="font-color-light mb-2">
                        {t('confirm.receiptNumber')}: {orderReceipt.customer_reference}
                      </p>
                      <p className="font-size-subheader">
                        {t('confirm.orderDetails')}
                      </p>
                    </div>
                    { this.renderPrintButton() }
                  </div>
                  <div className="border-bottom border-color-gray400 d-flex align-items-start py-4 flex-column flex-sm-row">
                    <div>
                      <p className="font-color-light mr-4 mb-3 mb-sm-0">
                        {t('confirm.shipsTo')}
                      </p>
                    </div>
                    <div className="flex-grow-1">
                      <p className="font-color-medium">{orderReceipt.shipping.street}</p>
                      {orderReceipt.shipping.street_2 && <p className="font-color-medium">{orderReceipt.shipping.street_2}</p>}
                      <p className="font-color-medium">{orderReceipt.shipping.town_city}, {orderReceipt.shipping.country_state}</p>
                      <p className="font-color-medium">{orderReceipt.shipping.postal_zip_code}, {orderReceipt.shipping.country}</p>
                    </div>
                  </div>
                  <div className="py-4 borderbottom border-color-gray400">
                    {orderReceipt.order.line_items.map((item) => (
                      <div key={item.id} className="d-flex flex-grow-1 mb-3">
                        <div className="flex-grow-1">
                          <p className="mb-2 font-weight-medium">
                            {item.quantity} x {item.product_name}
                          </p>
                          { item.selected_options && item.selected_options.length > 0 && (
                            /* todo support multiple variants here */
                            <p className="font-color-light">
                              {item.selected_options[0].group_name}: {item.selected_options[0].option_name}
                            </p>
                          ) }
                        </div>
                        <div className="text-right font-weight-semibold">
                          {item.line_total.formatted_with_code}
                        </div>
                      </div>
                    ))}
                  </div>

                  { this.renderSubtotal() }
                  { this.renderShippingTotal() }
                  { this.renderTotal() }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Root>
    );
  }
}

export default withRouter(connect(state => state)(withTranslation()(Confirm)));
