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
      description={'CustomDelete.description'}
      buttonTitle=""
      onButtonPress={onConfirm}
    />
  );
};

export default memo(DeleteProfileOrganism);
