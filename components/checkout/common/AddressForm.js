import React, { Component } from 'react';
import PropTypes from 'prop-types';
import commerce from '../../../lib/commerce';
import Dropdown from '../../common/atoms/Dropdown';
import { withTranslation } from 'react-i18next';

class AddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      subdivisions: {},
    };

    this.getRegions = this.getRegions.bind(this);
  }

  componentDidMount() {
    this.getRegions(this.props.country);
  }

  componentDidUpdate(prevProps, prevState) {
    const hasDeliveryCountryChanged = prevProps.country !== this.props.country;

    // refresh list of regions when delivery country has changed
    if (hasDeliveryCountryChanged) {
      this.getRegions(this.props.country);
    }
  }

  /**
   * Fetch available shipping regions for the chosen country
   *
   * @param {string} country
   */
   getRegions(country) {
    commerce.services.localeListSubdivisions(country).then(resp => {
      this.setState({
        subdivisions: resp.subdivisions
      })
    }).catch(error => console.log(error))
  }


  render() {
    const {
      type,
      countries,
      country,
      region,
      name,
      townCity,
      street,
      street2,
      postalZipCode,
      t,
    } = this.props;

    return (
      <>
        <div className="row">
          <div className="col-12 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                {t('checkout.shipping.fullName')}*
              </p>
              <input required name={`${type}[name]`} autoComplete="name" defaultValue={name} className="rounded-0 w-100" />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                {t('checkout.shipping.country')}*
              </p>
              <Dropdown
                required
                name={`${type}[country]`}
                value={country}
                placeholder={t('checkout.shipping.countryPlaceholder')}
              >
                {
                  Object.entries(countries).map(([code, name]) => (
                    <option value={code} key={code}>
                      { name }
                    </option>
                  ))
                }
              </Dropdown>
            </label>
          </div>
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                {t('checkout.shipping.city')}*
              </p>
              <input required name={`${type}[town_city]`} autoComplete="address-level2" defaultValue={townCity} className="rounded-0 w-100" />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                {t('checkout.shipping.street')}*
              </p>
              <input
                required
                autoComplete="street-address"
                name={`${type}[street]`}
                defaultValue={street}
                className="rounded-0 w-100"
                placeholder={t('checkout.shipping.streetPlaceholder')}
              />
            </label>
          </div>
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                {t('checkout.shipping.streetSecondary')}
              </p>
              <input
                name={`${type}[street_2]`}
                defaultValue={street2}
                className="rounded-0 w-100"
                placeholder={t('checkout.shipping.streetSecondaryPlaceholder')}
              />
            </label>
          </div>
        </div>
        <div className="row">
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                {t('checkout.shipping.region')}*
              </p>
              <Dropdown
                required
                name={`${type}[region]`}
                value={region}
                placeholder={t('checkout.shipping.regionPlaceholder')}
              >
                {
                  Object.entries(this.state.subdivisions).map(([code, name]) => (
                    <option key={code} value={code}>
                      { name }
                    </option>
                  ))
                }
              </Dropdown>
            </label>
          </div>
          <div className="col-12 col-sm-6 mb-3">
            <label className="w-100">
              <p className="mb-1 font-size-caption font-color-light">
                {t('checkout.shipping.zipCode')}*
              </p>
              <input
                required
                autoComplete="postal-code"
                name={`${type}[postal_zip_code]`}
                defaultValue={postalZipCode}
                className="rounded-0 w-100"
              />
            </label>
          </div>
        </div>
      </>
    );
  }
}

AddressForm.propTypes = {
  type: PropTypes.string,
  countries: PropTypes.any,
  country: PropTypes.string,
  region: PropTypes.string,
  name: PropTypes.string,
  townCity: PropTypes.string,
  street: PropTypes.string,
  street2: PropTypes.string,
  postalZipCode: PropTypes.string,
}

export default withTranslation()(AddressForm);