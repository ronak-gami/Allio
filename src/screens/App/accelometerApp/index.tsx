// import React, { useEffect, useState, useRef } from 'react';
// import { View, Button } from 'react-native';
// import {
//   accelerometer,
//   setUpdateIntervalForType,
//   SensorTypes,
// } from 'react-native-sensors';
// import { map } from 'rxjs/operators';
// import moment from 'moment';
// import { Text } from '@components/index';
// import useStyle from './styles';

// const AccelometerApp = () => {
//   const [isRight, setIsRight] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);

//   const startTimeRef = useRef(null);
//   const timerIntervalRef = useRef(null);
//   const savedSecondsRef = useRef(0);
//   const isRunningRef = useRef(false);

//   const styles = useStyle();

//   useEffect(() => {
//     setUpdateIntervalForType(SensorTypes.accelerometer, 300);

//     const subscription = accelerometer
//       .pipe(map(({ x }) => x))
//       .subscribe(xValue => {
//         if (xValue > 2 && isRight !== true) {
//           console.log('📱 Phone rotated RIGHT');
//           setIsRight(true);
//           autoStartTimer();
//         } else if (xValue < -2 && isRight !== false) {
//           console.log('📱 Phone rotated LEFT');
//           setIsRight(false);
//           endTimer();
//         }
//       });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [isRight]);

//   const autoStartTimer = () => {
//     console.log('called1');
//     if (!isRunningRef.current) {
//       console.log('called2');
//       startTimer();
//     }
//   };

//   const startTimer = () => {
//     console.log('▶️ Starting timer');
//     startTimeRef.current = moment().subtract(
//       savedSecondsRef.current,
//       'seconds',
//     );

//     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

//     timerIntervalRef.current = setInterval(() => {
//       const diff = moment().diff(startTimeRef.current, 'seconds');
//       setElapsedTime(diff);
//       console.log('⏱ Interval tick', diff);
//     }, 1000);

//     isRunningRef.current = true;
//     setIsRunning(true);
//   };

//   const stopTimer = () => {
//     if (timerIntervalRef.current) {
//       console.log('⏸ Stopping timer');
//       clearInterval(timerIntervalRef.current);
//       timerIntervalRef.current = null;
//     }
//     savedSecondsRef.current = elapsedTime;
//     isRunningRef.current = false;
//     setIsRunning(false);
//   };

//   const endTimer = () => {
//     if (timerIntervalRef.current) {
//       clearInterval(timerIntervalRef.current);
//       timerIntervalRef.current = null;
//     }
//     console.log('⏹ Ending timer & resetting');
//     startTimeRef.current = null;
//     savedSecondsRef.current = 0;
//     setElapsedTime(0);
//     isRunningRef.current = false;
//     setIsRunning(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>
//         {isRight === null
//           ? 'Rotate phone left/right to start'
//           : isRight
//           ? `⏱ Timer: ${elapsedTime} sec (Right)`
//           : '⏹ Timer stopped (Left)'}
//       </Text>

//       <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
//         {isRunning ? (
//           <Button title="Stop" onPress={stopTimer} />
//         ) : (
//           <Button title="Start" onPress={startTimer} />
//         )}
//         <Button title="End" onPress={endTimer} />
//       </View>
//     </View>
//   );
// };

// export default AccelometerApp;

// import React, { useEffect, useState, useRef } from 'react';
// import { View, Button } from 'react-native';
// import {
//   accelerometer,
//   setUpdateIntervalForType,
//   SensorTypes,
// } from 'react-native-sensors';
// import { map } from 'rxjs/operators';
// import moment from 'moment';
// import { Text } from '@components/index';
// import useStyle from './styles';

// const AccelometerApp = () => {
//   const [isFaceUp, setIsFaceUp] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [isRunning, setIsRunning] = useState(false);

//   const startTimeRef = useRef(null);
//   const timerIntervalRef = useRef(null);
//   const savedSecondsRef = useRef(0);
//   const isRunningRef = useRef(false);

//   const styles = useStyle();

//   useEffect(() => {
//     setUpdateIntervalForType(SensorTypes.accelerometer, 300);

//     const subscription = accelerometer
//       .pipe(map(({ z }) => z)) // use z-axis for face up/down
//       .subscribe(zValue => {
//         if (zValue > 0 && isFaceUp !== true) {
//           console.log('📱 Phone FACE UP');
//           setIsFaceUp(true);
//           autoStartTimer();
//         } else if (zValue < 0 && isFaceUp !== false) {
//           console.log('📱 Phone FACE DOWN');
//           setIsFaceUp(false);
//           endTimer();
//         }
//       });

//     return () => {
//       subscription.unsubscribe();
//     };
//   }, [isFaceUp]);

//   const autoStartTimer = () => {
//     if (!isRunningRef.current) {
//       startTimer();
//     }
//   };

//   const startTimer = () => {
//     console.log('▶️ Starting timer');
//     startTimeRef.current = moment().subtract(
//       savedSecondsRef.current,
//       'seconds',
//     );

//     if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

//     timerIntervalRef.current = setInterval(() => {
//       const diff = moment().diff(startTimeRef.current, 'seconds');
//       setElapsedTime(diff);
//       console.log('⏱ Interval tick', diff);
//     }, 1000);

//     isRunningRef.current = true;
//     setIsRunning(true);
//   };

//   const stopTimer = () => {
//     if (timerIntervalRef.current) {
//       console.log('⏸ Stopping timer');
//       clearInterval(timerIntervalRef.current);
//       timerIntervalRef.current = null;
//     }
//     savedSecondsRef.current = elapsedTime;
//     isRunningRef.current = false;
//     setIsRunning(false);
//   };

//   const endTimer = () => {
//     if (timerIntervalRef.current) {
//       clearInterval(timerIntervalRef.current);
//       timerIntervalRef.current = null;
//     }
//     console.log('⏹ Ending timer & resetting');
//     startTimeRef.current = null;
//     savedSecondsRef.current = 0;
//     setElapsedTime(0);
//     isRunningRef.current = false;
//     setIsRunning(false);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>
//         {isFaceUp === null
//           ? 'Flip phone up/down to start'
//           : isFaceUp
//           ? `⏱ Timer: ${elapsedTime} sec (Face Up)`
//           : '⏹ Timer stopped (Face Down)'}
//       </Text>

//       <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
//         {isRunning ? (
//           <Button title="Stop" onPress={stopTimer} />
//         ) : (
//           <Button title="Start" onPress={startTimer} />
//         )}
//         <Button title="End" onPress={endTimer} />
//       </View>
//     </View>
//   );
// };

// export default AccelometerApp;
import React, { useEffect, useState } from 'react';
import { AccelometerCard, Container, CustomFlatList } from '@components/index';
import { useNavigation } from '@react-navigation/native';
import { HOME } from '@utils/constant';
import accelometerService from '../../../realm/services/accelometerService';

const AccelometerApp = () => {
  const navigation = useNavigation();
  const [accelerometerData, setAccelerometerData] = useState([]);

  useEffect(() => {
    // Initialize static data on first load
    accelometerService.initializeStaticData();

    // Set up listener for real-time updates
    const removeListener = accelometerService.addAccelerometerListener(data => {
      setAccelerometerData(data);
    });

    // Cleanup listener on unmount
    return () => {
      removeListener();
    };
  }, []);

  const renderAccelometerCard = ({ item }: { item: any }) => {
    const handlePress = item => {
      navigation.navigate(HOME.AccelometerAppDetails, { item });
    };
    return (
      <AccelometerCard item={item} handlePress={() => handlePress(item)} />
    );
  };

  return (
    <Container showBackArrow title="Accelometer">
      <CustomFlatList
        data={accelerometerData}
        removeClippedSubviews={false}
        renderItem={renderAccelometerCard}
      />
    </Container>
  );
};

export default AccelometerApp;
