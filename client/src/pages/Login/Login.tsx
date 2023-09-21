import React from 'react';
import { externalLink } from '../../constants';
import { ReactComponent as Logo } from '../../images/enchanta-logo.svg';
import { ReactComponent as GoogleIcon } from '../../images/icons/social/google-icon.svg';
import { google } from '../../store';
import './Login.scss';

function Login() {
  return (
    <section className="login">
      <div className="login__inner">
        <Logo className="login__logo" />
        <h1 className="login__title title">Welcome to Enchanta</h1>
        <p className="login__subtitle subtitle">
          Where imagination and creativity come to life for your kids
        </p>
        <button
          className="login__button"
          type="button"
          onClick={() => (location.href = google)}
        >
          <GoogleIcon />
          <span className="login__button-text">Join with Google</span>
          <div className="login__button-stub" />
        </button>
        <div className="login__terms">
          <a
            className="login__terms-link"
            href={externalLink.termsOfService}
            target="_blank"
            rel="noreferrer"
          >
            Terms of Service
          </a>
          <a
            className="login__terms-link"
            href={externalLink.privacyPolicy}
            target="_blank"
            rel="noreferrer"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </section>
  );
}

export default Login;
