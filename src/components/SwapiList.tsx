import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

import {StarshipType, PilotType, FilmType, useSwapi} from '../hooks/useSwapi';

function SwapiList(): React.JSX.Element {
  const [starships] = useSwapi();

  const renderItem = ({item}: {item: StarshipType}) => {
    const filmsList = item.filmConnection.films.map(
      (film: FilmType) => film.title,
    );

    const pilotsList = item.pilotConnection.pilots.map(
      (pilot: PilotType) => pilot.name,
    );

    return (
      <View style={styles.itemRow}>
        <Text style={styles.shipName}>{item.name}</Text>
        <Text style={styles.movies}>Seen in: {filmsList.join(', ')}</Text>
        {pilotsList.length ? (
          <Text style={styles.movies}>Flown by: {pilotsList.join(', ')}</Text>
        ) : null}
      </View>
    );
  };

  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <FlatList
      data={starships}
      keyExtractor={item => `${item.id}`}
      renderItem={renderItem}
      ItemSeparatorComponent={renderSeparator}
    />
  );
}

const styles = StyleSheet.create({
  itemRow: {
    padding: 10,
  },

  shipName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  separator: {
    borderBottomWidth: 1.5,
    borderColor: 'black',
    marginHorizontal: 5,
  },

  movies: {
    paddingTop: 10,
    fontSize: 14,
  },
});

export default SwapiList;
