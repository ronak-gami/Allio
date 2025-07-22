import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home';
import PhotoMedia from '../screens/PhotoMedia';
import ScanQR from '../screens/ScanQR';
import VideoMedia from '../screens/VideoMedia';
import MoreScreens from '../screens/More';

const Tab = createBottomTabNavigator();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Photo" component={PhotoMedia} />
      <Tab.Screen name="ScanQR" component={ScanQR} />
      <Tab.Screen name="Video" component={VideoMedia} />
      <Tab.Screen name="More" component={MoreScreens} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
