import React, { memo } from 'react';
import Customlogout from '@components/molecules/Customlogout';
import { IMAGES } from '@assets/index';

interface DeleteProfileOrganismProps {
  onConfirm: () => void;
}

const DeleteProfileOrganism: React.FC<DeleteProfileOrganismProps> = ({
  onConfirm,
}) => {
  return (
    <Customlogout
      image={IMAGES.Deleteimage}
      description="Are you sure you want to delete your account? This action cannot be undone."
      buttonTitle=""
      onButtonPress={onConfirm}
    />
  );
};

export default memo(DeleteProfileOrganism);
