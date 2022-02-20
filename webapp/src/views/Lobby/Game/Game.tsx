import { ThumbUp, Public, Flag, People } from '@mui/icons-material';
import { Box, Tabs, Tab } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { useMatch } from 'react-location';
import { usePreloadedQuery } from 'react-relay';

import type { FC } from 'react';
import { useState } from 'react';

import { Actions } from './Actions';
import { CountryStatistics } from './CountryStatistics';
import { VoiceChat } from './VoiceChat';
import { WorldStatistics } from './WorldStatistics';

import { SortingRoom } from '../SortingRoom';

import type { LobbyLocation } from '../LobbyLocations';
import type { Game_game_Query } from './__generated__/Game_game_Query.graphql';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    style={{ height: '100%' }}
  >
    {value === index && children}
  </div>
);

function a11yProps (index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export const Game: FC = () => {
  const {
    data: { gameRef },
  } = useMatch<LobbyLocation>();

  const data = usePreloadedQuery<Game_game_Query>(
    graphql`
      query Game_game_Query($gameId: ID!) {
        node(id: $gameId) {
          id
          ... on Game {
            ...VoiceChat_clients_Fragment

            clients {
              id
              login
            }

            teams {
              players {
                roles
                users {
                  login
                  id
                }
              }
              nation
            }
          }
        }
        authorizedUser {
          id
        }
      }
    `,
    gameRef!,
  );

  const [value, setValue] = useState(0);

  const onChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexGrow: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tabs value={value} onChange={onChange} aria-label="tabs">
            <Tab icon={<People />} iconPosition="start" label="Conference Hall" {...a11yProps(0)} />
            <Tab
              icon={<Flag  />}
              iconPosition="start"
              label="Country Statistics"
              {...a11yProps(1)}
            />
            <Tab
              icon={<Public />}
              iconPosition="start"
              label="World Statistics"
              {...a11yProps(2)}
            />
            <Tab icon={<ThumbUp />} iconPosition="start" label="Actions" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: '1 1 0',
            overflow: 'auto',
          }}>
          <TabPanel value={value} index={0}>
            <SortingRoom />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <CountryStatistics />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <WorldStatistics />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Actions />
          </TabPanel>
        </Box>
      </Box>

      {/* TODO handle it */}
      <VoiceChat userId={data.authorizedUser.id} data={data.node!} />
    </Box>
  );
};
