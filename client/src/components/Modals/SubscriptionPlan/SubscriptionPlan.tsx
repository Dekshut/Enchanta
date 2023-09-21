import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { subscriptionPlans } from '../../../constants';
import { getImage } from '../../../helpers';
import apprentice from '../../../images/icons/subscription/apprentice.png';
import practicioner from '../../../images/icons/subscription/practicioner.png';
import wizard from '../../../images/icons/subscription/wizard.png';
import { useSubscriptionStore, useUserStore } from '../../../store';
import { PrimaryButton } from '../../Buttons';
import { ModalHeader, ModalWrapper } from '../../ModalConstructor';
import './SubscriptionPlan.scss';

type SubscriptionType = keyof Subscriptions;

function SubscriptionPlan() {
  const [type, setType] = useState<SubscriptionType>('monthly');
  const [loader, setLoader] = useState<boolean>(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');
  const { stripeUrl, getStripeUrl, resetStripeUrl } = useSubscriptionStore(
    (store: ISubscriptionStore & ISubscriptionActions) => store,
  );
  const { email } = useUserStore((store: IUserStoreState) => store);

  const [searchParams] = useSearchParams() || '';
  const navigate = useNavigate();
  const planImage = [apprentice, practicioner, wizard];

  useEffect(() => {
    if (stripeUrl) {
      const proceedToCheckout = () => {
        window.location.href = stripeUrl;
      };
      setLoader(false);
      proceedToCheckout();
      resetStripeUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeUrl]);

  useEffect(() => {
    if (selectedPlanId) {
      getStripeUrl({ priceId: selectedPlanId, email });
      setSelectedPlanId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlanId]);

  const onClose = () => {
    searchParams.delete('subscription-plan');
    navigate(`?${searchParams.toString()}`, { replace: true });
  };

  return (
    <ModalWrapper>
      <section className="subscription-plan">
        <ModalHeader onClose={onClose} />
        <div className="subscription-plan__content">
          <div className="subscription-plan__inner">
            <div className="subscription-plan__header">
              <h2 className="subscription-plan__title title">
                Pricing Options for Your Needs
              </h2>
              <p className="subscription-plan__subtitle subtitle">
                {`No matter the subscription option you choose,
            monthly, annual or pay-per-story,
            you\'ll have access to all of Enchanta\'s features`}
              </p>
            </div>
            <div className="subscription-plan__tabs">
              <div className="subscription-plan__tabs-helper">
                <p className="subscription-plan__tabs-helper-text">
                  UP TO 25% OFF
                </p>
              </div>
              <ul className="subscription-plan__tabs-list">
                <li className="subscription-plan__tabs-item">
                  <button
                    className={`subscription-plan__tabs-button${
                      type === 'monthly' ? ' selected' : ''
                    }`}
                    type="button"
                    onClick={() => setType('monthly')}
                  >
                    Monthly
                  </button>
                </li>
                <li className="subscription-plan__tabs-item">
                  <button
                    className={`subscription-plan__tabs-button${
                      type === 'annual' ? ' selected' : ''
                    }`}
                    type="button"
                    onClick={() => setType('annual')}
                  >
                    Annual
                  </button>
                </li>
                <li className="subscription-plan__tabs-item">
                  <button
                    className={`subscription-plan__tabs-button${
                      type === 'payPerStory' ? ' selected' : ''
                    }`}
                    type="button"
                    onClick={() => setType('payPerStory')}
                  >
                    Pay-Per-Story
                  </button>
                </li>
              </ul>
            </div>
            <ul className="subscription-plan__list">
              {subscriptionPlans[type].map((plan: Subscribe, index: number) => (
                <li key={index} className="subscription-plan__item">
                  {type === 'annual' && index === 2 ? (
                    <div className="subscription-plan__item-helper">
                      <p className="subscription-plan__item-helper-text">
                        BEST VALUE PER STORY
                      </p>
                    </div>
                  ) : null}
                  <h3 className="subscription-plan__item-title">
                    {plan.title}
                  </h3>
                  {getImage(
                    planImage[index],
                    plan.title,
                    '64',
                    'auto',
                    'subscription-plan__item-image',
                  )}
                  <div className="subscription-plan__pricing">
                    <p className="subscription-plan__pricing-cost">
                      <sup className="subscription-plan__pricing-currency">
                        $
                      </sup>
                      <span className="subscription-plan__pricing-value">
                        {plan.value}
                      </span>
                    </p>
                    <p className="subscription-plan__pricing-period">
                      {plan.sub}
                    </p>
                  </div>
                  <div className="subscription-plan__devider" />
                  <ul className="subscription-plan__desc">
                    <li className="subscription-plan__desc-item">
                      {plan.desc1}
                      <span className="subscription-plan__desc-item--heavy">
                        {plan.desc2}
                      </span>
                      {plan.desc3}
                    </li>
                  </ul>
                  <PrimaryButton
                    iconPosition="none"
                    loader={selectedPlanId === plan.id && loader}
                    width={type === 'payPerStory' ? '116px' : '166px'}
                    text={type === 'payPerStory' ? 'Buy Now' : 'Subscribe Now'}
                    onClick={() => {
                      setSelectedPlanId(plan.id);
                      setLoader(true);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </ModalWrapper>
  );
}

export default SubscriptionPlan;
