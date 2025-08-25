import { Container } from '@components/index';
import ChipInputComponent from '@components/molecules/ChipInputComponent';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const ChipInputScreen = () => {
  return (
    <Container showHeader showBackArrow title="Add Labels">
      <ChipInputComponent />
    </Container>
  );
};

const styles = StyleSheet.create({});

export default ChipInputScreen;
