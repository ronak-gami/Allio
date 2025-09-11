// import React, { useEffect, useState, useRef, useCallback } from 'react';
// import { View } from 'react-native';
// import {
//   accelerometer,
//   setUpdateIntervalForType,
//   SensorTypes,
// } from 'react-native-sensors';
// import { map } from 'rxjs/operators';
// import moment from 'moment';

// import { Button, Text } from '@components/index';

// import useStyle from './styles';
// import accelometerService from '../../../../realm/services/accelometerService';

// const AccelometerAppDetails = ({ route }) => {
//   const item = route.params?.item;

//   const [isFaceUp, setIsFaceUp] = useState(null);
//   const [elapsedTime, setElapsedTime] = useState(item?.time || 0);
//   const [isRunning, setIsRunning] = useState(false);

//   const startTimeRef = useRef(null);
//   const timerIntervalRef = useRef(null);
//   const savedSecondsRef = useRef(item?.time || 0);

//   const styles = useStyle();

//   // Common function to clear timer interval
//   const clearTimerInterval = useCallback(() => {
//     if (timerIntervalRef.current) {
//       clearInterval(timerIntervalRef.current);
//       timerIntervalRef.current = null;
//     }
//   }, []);

//   // Common function to update timer state
//   const updateTimerState = useCallback(running => {
//     setIsRunning(running);
//   }, []);

//   // Common function to save current elapsed time
//   const saveCurrentTime = useCallback(() => {
//     savedSecondsRef.current = elapsedTime;
//     accelometerService.updateItemTime(item.id, elapsedTime);
//   }, [elapsedTime, item.id]);

//   // Initialize timer from Realm data
//   useEffect(() => {
//     setElapsedTime(item?.time || 0);
//     savedSecondsRef.current = item?.time || 0;
//   }, [item]);

//   // Accelerometer sensor subscription
//   useEffect(() => {
//     setUpdateIntervalForType(SensorTypes.accelerometer, 300);

//     const subscription = accelerometer
//       .pipe(map(({ z }) => z))
//       .subscribe(zValue => {
//         if (zValue > 0 && isFaceUp !== true) {
//           setIsFaceUp(true);
//           autoStartTimer();
//         } else if (zValue < 0 && isFaceUp !== false) {
//           setIsFaceUp(false);
//           handleFaceDownStop();
//         }
//       });

//     return () => subscription.unsubscribe();
//   }, [isFaceUp, elapsedTime]);

//   // Handle face down stop
//   const handleFaceDownStop = useCallback(() => {
//     clearTimerInterval();
//     saveCurrentTime();
//     updateTimerState(false);
//   }, [clearTimerInterval, saveCurrentTime, updateTimerState]);

//   // Auto start timer if not already running
//   const autoStartTimer = useCallback(() => {
//     if (!isRunning) {
//       startTimer();
//     }
//   }, [isRunning]);

//   // Start timer function
//   const startTimer = useCallback(() => {
//     startTimeRef.current = moment().subtract(
//       savedSecondsRef.current,
//       'seconds',
//     );
//     clearTimerInterval();

//     timerIntervalRef.current = setInterval(() => {
//       const diff = moment().diff(startTimeRef.current, 'seconds');
//       setElapsedTime(diff);
//     }, 1000);

//     updateTimerState(true);
//   }, [clearTimerInterval, updateTimerState]);

//   // Stop timer function
//   const stopTimer = useCallback(() => {
//     clearTimerInterval();
//     saveCurrentTime();
//     updateTimerState(false);
//   }, [clearTimerInterval, saveCurrentTime, updateTimerState]);

//   // Reset timer function
//   const resetTimer = useCallback(() => {
//     clearTimerInterval();
//     startTimeRef.current = null;
//     savedSecondsRef.current = 0;
//     setElapsedTime(0);
//     accelometerService.updateItemTime(item.id, 0);
//     updateTimerState(false);
//   }, [clearTimerInterval, updateTimerState, item.id]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => clearTimerInterval();
//   }, [clearTimerInterval]);

//   // Render timer status text
//   const renderTimerStatus = () => {
//     const status = isFaceUp ? '(Face Up)' : '(Face Down)';
//     return `⏱ Timer: ${elapsedTime} sec ${status}`;
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Item: {item?.name}</Text>
//       <Text style={styles.title}>{renderTimerStatus()}</Text>

//       <View style={{ flexDirection: 'row', marginTop: 20, gap: 10 }}>
//         {isRunning ? (
//           <Button title="Stop" onPress={stopTimer} style={styles.btn} />
//         ) : (
//           <Button title="Start" onPress={startTimer} style={styles.btn} />
//         )}
//         <Button title="Cancel" onPress={resetTimer} style={styles.btn} />
//       </View>
//     </View>
//   );
// };

// export default AccelometerAppDetails;

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View } from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import { map } from 'rxjs/operators';
import moment from 'moment';

import { Button, Text } from '@components/index';
import useStyle from './styles';
import accelometerService from '../../../../realm/services/accelometerService';

interface RouteParams {
  item: {
    id: string;
    name: string;
    time?: number;
  };
}

interface Props {
  route: {
    params?: RouteParams;
  };
}

const AccelometerAppDetails: React.FC<Props> = ({ route }) => {
  const item = route.params?.item;

  const [isFaceUp, setIsFaceUp] = useState<boolean | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(item?.time || 0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [autoTimerEnabled, setAutoTimerEnabled] = useState<boolean>(true);

  const startTimeRef = useRef<moment.Moment | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const savedSecondsRef = useRef<number>(item?.time || 0);

  const styles = useStyle();

  const clearTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const saveTimeToRealm = useCallback(
    (time: number) => {
      accelometerService.updateItemTime(item.id, time);
    },
    [item.id],
  );

  const startTimer = useCallback(() => {
    startTimeRef.current = moment().subtract(
      savedSecondsRef.current,
      'seconds',
    );
    clearTimer();

    timerIntervalRef.current = setInterval(() => {
      if (startTimeRef.current) {
        const diff = moment().diff(startTimeRef.current, 'seconds');
        setElapsedTime(diff);
      }
    }, 1000);

    setIsRunning(true);
  }, [clearTimer]);

  const stopTimer = useCallback(() => {
    clearTimer();
    savedSecondsRef.current = elapsedTime;
    saveTimeToRealm(elapsedTime);
    setIsRunning(false);
    setAutoTimerEnabled(false);
  }, [clearTimer, elapsedTime, saveTimeToRealm]);

  const resetTimer = useCallback(() => {
    clearTimer();
    startTimeRef.current = null;
    savedSecondsRef.current = 0;
    setElapsedTime(0);
    saveTimeToRealm(0);
    setIsRunning(false);
    setAutoTimerEnabled(true);
  }, [clearTimer, saveTimeToRealm]);

  // Accelerometer handling
  const handlePhonePositionChange = useCallback(
    (zValue: number) => {
      const newIsFaceUp = zValue > 0;

      if (newIsFaceUp !== isFaceUp) {
        setIsFaceUp(newIsFaceUp);

        if (autoTimerEnabled) {
          if (newIsFaceUp && !isRunning) {
            startTimer();
          } else if (!newIsFaceUp && isRunning) {
            stopTimer();
          }
        }
      }
    },
    [isFaceUp, autoTimerEnabled, isRunning, startTimer, stopTimer],
  );

  // Effects
  useEffect(() => {
    setElapsedTime(item?.time || 0);
    savedSecondsRef.current = item?.time || 0;
  }, [item]);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 300);

    const subscription = accelerometer
      .pipe(map(({ z }) => z))
      .subscribe(handlePhonePositionChange);

    return () => subscription.unsubscribe();
  }, [handlePhonePositionChange]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  // Render timer status
  const renderTimerStatus = () => {
    const position = isFaceUp ? 'Face Up' : 'Face Down';
    const status = isRunning ? 'Running' : 'Stopped';
    return `⏱ Timer: ${elapsedTime} sec ${position} - ${status}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item: {item?.name}</Text>
      <Text style={styles.title}>{renderTimerStatus()}</Text>

      <View style={{ marginTop: 50 }}>
        <Button title="Countinue" onPress={startTimer} style={styles.btn} />
        <Button title="Stop" onPress={stopTimer} style={styles.btn} />
        <Button title="Cancel" onPress={resetTimer} style={styles.btn} />
      </View>
    </View>
  );
};

export default AccelometerAppDetails;
