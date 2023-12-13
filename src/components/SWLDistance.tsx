import React, {useCallback, useEffect, useState} from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  Permission,
} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {convertDistance, getDistance} from 'geolib';
import {GeolibInputCoordinates} from 'geolib/es/types';

const starWarsLandLocation = {
  latitude: 33.814831976267016,
  longitude: -117.92057887641796,
};

function SWLDistance(): React.JSX.Element {
  const [distance, setDistance] = useState<string | number | undefined>();
  const [permissions, setPermissions] = useState<string | undefined>();
  const [hasError, setHasError] = useState<Error | undefined>();
  const [userLocation, setUserLocation] = useState<GeolibInputCoordinates>();

  const getLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      position => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        setHasError(new Error(error.message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );
  }, []);

  const requestPermissions = useCallback(
    (permType: Permission) => {
      request(permType).then(result => {
        setPermissions(result);
        if (result === RESULTS.GRANTED && !userLocation) {
          getLocation();
        }
      });
    },
    [getLocation, userLocation],
  );

  useEffect(() => {
    if (permissions === 'granted' || permissions === 'limited') {
      return;
    }
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
  }, [getLocation, permissions, requestPermissions]);

  useEffect(() => {
    if (userLocation !== undefined) {
      setDistance(
        Number.parseFloat(
          convertDistance(
            getDistance(userLocation, starWarsLandLocation),
            'mi',
          ).toString(),
        ).toFixed(2),
      );
    }
  }, [getLocation, userLocation]);

  return (
    <View style={styles.container}>
      {hasError ? (
        <Text style={[styles.error, styles.heading]}>
          We need location permissions to tell you how close you are to Star
          Wars Land! Error {hasError.message}
        </Text>
      ) : (
        <View style={styles.textContainer}>
          <Text style={styles.heading}>
            {distance ? 'Your current distance to Star Wars Land' : 'Loading'}
          </Text>
          <Text style={styles.distance}>{distance && distance + ' miles'}</Text>
        </View>
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

  textContainer: {
    alignItems: 'center',
  },

  error: {
    color: 'red',
  },

  heading: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },

  distance: {
    fontSize: 16,
    color: 'blue',
  },
});

export default SWLDistance;
