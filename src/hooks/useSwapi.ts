import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import {useState, useEffect} from 'react';

const starshipQuery = gql`
  query Query {
    allStarships {
      starships {
        MGLT
        cargoCapacity
        consumables
        costInCredits
        created
        crew
        edited
        filmConnection {
          films {
            id
            title
          }
        }
        starshipClass
        id
        model
        name
        passengers
        pilotConnection {
          pilots {
            id
            name
            gender
          }
        }
        hyperdriveRating
        length
        manufacturers
        maxAtmospheringSpeed
      }
    }
  }
`;

export type StarshipType = {
  MGLT: number;
  id: string;
  cargoCapacity: number;
  consumables: string;
  costInCredits: number;
  created: string;
  crew: string;
  edited: string;
  filmConnection: films;
  manufacturers: [string];
  maxAtmospheringSpeed: number;
  model: string;
  name: string;
  passengers: string;
  pilotConnection: pilots;
  starshipClass: string;
};

export type StarshipTypes = [StarshipType];

type films = {
  films: [FilmType];
};

export type FilmType = {
  id: string;
  title: string;
};

type pilots = {
  pilots: [PilotType];
};

export type PilotType = {
  id: string;
  name: string;
  gender: string;
};

export function useSwapi() {
  const [starships, setStarships] = useState<StarshipTypes | []>([]);

  useEffect(() => {
    const client = new ApolloClient({
      uri: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      cache: new InMemoryCache(),
    });

    client.query({query: starshipQuery}).then(result => {
      setStarships(result.data.allStarships.starships);
    });
  }, []);

  return [starships];
}
