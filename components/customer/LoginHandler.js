import React, { Component } from 'react';
import Head from 'next/head';
import Router, { withRouter } from 'next/router';
import { connect } from 'react-redux';
import { setCustomer } from '../../store/actions/authenticateActions';
import commerce from '../../lib/commerce';
import Root from '../../components/common/Root';
import Footer from '../../components/common/Footer';
import LoginAnimation from '../../components/customer/LoginAnimation';
import { withTranslation } from 'react-i18next';

class LoginHandler extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      loading: false,
      isError: false,
      message: null,
    };

    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.loginCustomer = this.loginCustomer.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      // Get the 'token' from route
      const { token } = this.props.router.query;
      
      if (!token) {
        return;
      }

      const { setCustomer, t } = this.props;

      this.setState({
        loading: true,
        isError: false,
        message: null,
      });

      commerce.customer.getToken(token)
        .then(() => {
          // Fetch customer details
          return setCustomer().then(() => Router.push('/account'));
        })
        .catch(() => {
          this.setState({
            loading: false,
            isError: true,
            message: [
              t('login.linkExpired')
            ],
          });
        });
    }, 500);
  }

  /**
   * Change handler for the email address field
   */
  handleChangeEmail(event) {
    this.setState({
      email: event.target.value
    });
  }

  /**
   * Perform a request to Commerce.js to log the user in by their email address. If the
   * user's email address exists, a login link will be emailed to them.
   *
   * @see https://commercejs.com/docs/api/#issue-and-send-login-token
   */
  loginCustomer(e) {
    e.preventDefault();

    const { email } = this.state;
    const { t } = this.props;

    // Reset messaging.
    this.setState({
      isError: false,
      message: null,
    });

    return commerce.customer.login(
      email,
      `${window.location.origin}/login?token={token}`
    )
      .then((result) => {
        this.setState({
          isError: false,
          email: '',
          message: [
            t('login.linkConfirmation')
          ]
        });
      })
      .catch((error)=>{
        this.setState({
          isError: true,
          message: error.data.error.errors.email,
        });
      });
  }

  /**
   * Render any errors or success messages
   */
  renderAlert() {
    const { isError, message } = this.state;
    if (!message) {
      return null;
    }

    // Generate alert message as either list or single line.
    const alertMessage = message.length === 1
      ? message[0]
      : (
        <ul className="text-left m-0">
          { message.map((copy) => <li key={copy}>{copy}</li>) }
        </ul>
      );

    return (
      <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>
        { alertMessage }
      </div>
    );
  }

  /**
   * Render the login form
   */
  renderForm() {
    const { email } = this.state;
    const { t } = this.props;

    return (
      <form>
        <label className="w-100 mb-4">
          <p className="mb-1 font-size-caption font-color-light text-left">
            {t('common.emailAddress')}
          </p>
          <input
            name="email"
            type="email"
            onChange={this.handleChangeEmail}
            value={email}
            className="rounded-0 w-100"
            required
          />
        </label>
        <button
          className="bg-brand700 font-color-white w-100 border-none h-56 font-size-title"
          type="submit"
          onClick={this.loginCustomer}
        >
          {t('login.getLink')}
        </button>
      </form>
    );
  }

  render() {
    const { loading } = this.state;
    const { t } = this.props;

    if (loading) {
      return (
        <Root>
          <Head>
            <title>
              {t('login.loggingIn')}
            </title>
          </Head>
          <LoginAnimation />
        </Root>
      );
    }

    return (
      <Root>
        <Head>
          <title>
            {t('common.login')}
          </title>
        </Head>
        <div className="login-container pt-1 pb-0 px-3 pt-sm-0 px-sm-0 mx-auto my-0 mw-1600">
          <div className="row mt-5 pt-5">
            <div className="col-12 col-md-6 col-lg-6 offset-lg-3 offset-md-3  row-content text-center">
              <div className="py-5 px-4 px-sm-5">
                <h2 className="font-size-header mb-4">
                  {t('common.login')}
                </h2>
                <p className="text-left mb-4 font-size-body">
                  {t('login.helper')}
                </p>
                { this.renderAlert() }
                { this.renderForm() }
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Root>
    );
  }
}

export default withRouter(
  connect(
    state => state, 
    { setCustomer },
  )(withTranslation()(LoginHandler))
);
