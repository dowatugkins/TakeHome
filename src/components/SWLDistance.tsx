import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';

const starWarsLandLocation = '33.814831976267016, -117.92057887641796';

function SWLDistance(): React.JSX.Element {
  const distance = 10;
  const [permissions, setPermissions] = useState<String | undefined>();
  const [hasError, setHasError] = useState<Error | undefined>();
  const [userLocation, setUserLocation] = useState<
    Geolocation.GeoPosition | undefined
  >();

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation(position);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  };

  const requestPermissions = (permType: Permission) => {
    request(permType).then(result => {
      setPermissions(result);
      if (result === RESULTS.GRANTED) {
        getLocation();
      }
    });
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setPermissions('unavailable');
              break;
            case RESULTS.DENIED:
              requestPermissions(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
              break;
            case RESULTS.LIMITED:
              setPermissions('limited');
              getLocation();
              break;
            case RESULTS.GRANTED:
              setPermissions('granted');
              getLocation();
              break;
            case RESULTS.BLOCKED:
              setPermissions('blocked');
              break;
          }
        })
        .catch(error => {
          setHasError(error);
        });
    } else if (Platform.OS === 'android') {
      check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              setPermissions('unavailable');
              break;
            case RESULTS.DENIED:
              requestPermissions(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
              break;
            case RESULTS.LIMITED:
              setPermissions('limited');
              getLocation();
              break;
            case RESULTS.GRANTED:
              setPermissions('granted');
              getLocation();
              break;
            case RESULTS.BLOCKED:
              setPermissions('blocked');
              break;
          }
        })
        .catch(error => {
          setHasError(error);
        });
    } else {
      setHasError(new Error('Unknown OS, only available on Android and iOS'));
    }
  }, []);
  console.log(permissions);

  return (
    <View style={styles.container}>
      {hasError ? (
        <Text style={[styles.error, styles.heading]}>
          We need location permissions to tell you how close you are to Star
          Wars Land! Error {hasError.message}
        </Text>
      ) : (
        <>
          <Text style={styles.heading}>
            Your current distance to Star Wars Land
          </Text>
          <Text style={styles.distance}>{distance}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderBottomWidth: 2.5,
    borderColor: 'black',
  },

  error: {
    color: 'red',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },

  distance: {
    fontSize: 16,
  },
});

export default SWLDistance;
