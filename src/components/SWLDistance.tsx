import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {check, PERMISSIONS, RESULTS} from 'react-native-permissions';

const starWarsLandLocation = '33.814831976267016, -117.92057887641796';

function SWLDistance(): React.JSX.Element {
  const distance = 10;
  const [permissions, setPermissions] = useState();
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            console.log(
              'This feature is not available (on this device / in this context)',
            );
            break;
          case RESULTS.DENIED:
            console.log(
              'The permission has not been requested / is denied but requestable',
            );
            break;
          case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            break;
          case RESULTS.GRANTED:
            console.log('The permission is granted');
            break;
          case RESULTS.BLOCKED:
            console.log('The permission is denied and not requestable anymore');
            break;
        }
      })
      .catch(error => {
        setHasError(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {hasError ? (
        <Text style={[styles.error, styles.heading]}>
          We need location permissions to tell you how close you are to Star
          Wars Land! Error {hasError}
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
