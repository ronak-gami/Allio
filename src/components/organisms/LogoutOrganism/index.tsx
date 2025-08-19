import React, { memo } from 'react';
import Customlogout from '@components/molecules/Customlogout';
import { ICONS, IMAGES } from '@assets/index';
interface LogoutOrganismProps {
  onConfirm: () => void;
}

const LogoutOrganism: React.FC<LogoutOrganismProps> = ({ onConfirm }) => {
  return (
    <Customlogout
      image={IMAGES.Logout}
      description={'CustomLogout.description'}
      buttonTitle=""
      onButtonPress={onConfirm}
    />
  );
};

export default memo(LogoutOrganism);
