import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../App.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

export const LogInButton = (props) => {
  const { loginWithRedirect } = useAuth0();
  const { t } = useTranslation();

  return (
    <OverlayTrigger
      delay={{ show: 250, hide: 400 }}
      placement='bottom'
      overlay={<Tooltip id='tooltip-disabled'>{t('log_in')}!</Tooltip>}
    >
      <button
        className={(props.size === 'big' ? 'big-log-in-button ' : '') + 'btn btn-primary btn-block'}
        onClick={() => loginWithRedirect()}
      >
        {t('log_in')}
      </button>
    </OverlayTrigger>
  );
};
