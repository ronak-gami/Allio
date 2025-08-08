import React from 'react';
import Customlogout from '@components/molecules/Customlogout';
import { ICONS, IMAGES } from '@assets/index';
interface LogoutOrganismProps {
  onConfirm: () => void;
}

const LogoutOrganism: React.FC<LogoutOrganismProps> = ({ onConfirm }) => {
  return (
    <Customlogout
      image={IMAGES.Logout}
      description="Are you sure you want to logout?"
      buttonTitle=""
      onButtonPress={onConfirm}
    />
  );
};

export default LogoutOrganism;
