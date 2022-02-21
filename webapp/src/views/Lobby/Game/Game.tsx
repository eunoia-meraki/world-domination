import { ThumbUp, Public, Flag, People, ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, Tabs, Tab, IconButton } from '@mui/material';
import graphql from 'babel-plugin-relay/macro';
import { useMatch } from 'react-location';
import { usePreloadedQuery, useSubscription } from 'react-relay';

import type { FC } from 'react';
import { useState } from 'react';

import { Actions } from './Actions';
import { CountryStatistics } from './CountryStatistics';
import { VoiceChat } from './VoiceChat';
import { WorldStatistics } from './WorldStatistics';

import { SortingRoom } from '../SortingRoom';

import type { LobbyLocation } from '../LobbyLocations';
import type { Game_gameSubscription_Subscription } from './__generated__/Game_gameSubscription_Subscription.graphql';
import type { Game_game_Query, Game_game_Query$data } from './__generated__/Game_game_Query.graphql';
import type { ClientData } from './types';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
graphql`
  fragment Game_game_Fragment on Game {
    clients {
      id
      login
    }

    teams {
      id 
      voiceChatRoomId
      players {
        id
        user {
          id
        }
        guestTeamRoom {
          id
        }
      }
      teamRoom {
        id
      }
    }
    status
  }`;

const getVoiceChatId = (data: Game_game_Query$data) => {
  const { node } = data;
  if (!node) {
    return null;
  }

  const { teams } = node;

  if (!teams) {
    return null;
  }

  const players = teams.map(team => team.players)
    .reduce((acc, arr) => [...acc, ...arr], []);

  const player = players.find(plr => plr.user.id === data.authorizedUser.id);

  if (!player) {
    return null;
  }
  const guestTeamRoomId = player.guestTeamRoom?.id;

  if (guestTeamRoomId) {
    return guestTeamRoomId;
  }

  const team = teams.find(curTeam => curTeam.players.some(plr => plr.id === player.id ));

  if (!team) {
    return null;
  }

  return team.voiceChatRoomId;
};

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
    style={{ minHeight: '100%' }}
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
            ...Game_game_Fragment @relay(mask: false)
            ...SortingRoom_game_Fragment
          }
        }
        authorizedUser {
          id
          login
        }
      }
    `,
    gameRef!,
  );

  const game = data?.node;

  useSubscription<Game_gameSubscription_Subscription>({
    subscription: graphql`
      subscription Game_gameSubscription_Subscription {
        gameSubscription {
          clients {
            id
            login
          }

          ...Game_game_Fragment @relay(mask: false)
          ...SortingRoom_game_Fragment
        }
      }
    `,
    variables: {},
    onNext: subscData =>
      // eslint-disable-next-line no-console
      console.log(`Game_gameSubscription_Subscription ${JSON.stringify(subscData)}`),
  });

  const [value, setValue] = useState(0);

  const onChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [open, setOpen] = useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const clientData = // TODO optimization
    game?.clients?.reduce(
      (acc: ClientData, client) => ({
        ...acc,
        [client.id]: client.login,
      }),
      { [data.authorizedUser.id]: data.authorizedUser.login },
    ) || {};

  const voiceChatId = getVoiceChatId(data);
  // eslint-disable-next-line no-console
  console.log(voiceChatId);

  return (
    game && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: 1,
            borderColor: 'divider',
          }}
        >
          <Tabs
            sx={{
              minHeight: '42px',
            }}
            value={value}
            onChange={onChange}
            aria-label="tabs"
          >
            <Tab
              sx={{
                minHeight: '42px',
                p: '9px',
              }}
              icon={<People />}
              iconPosition="start"
              label="Conference Hall"
              {...a11yProps(0)}
            />
            <Tab
              sx={{
                minHeight: '42px',
                p: '9px',
              }}
              icon={<Flag />}
              iconPosition="start"
              label="Country Statistics"
              {...a11yProps(1)}
            />
            <Tab
              sx={{
                minHeight: '42px',
                p: '9px',
              }}
              icon={<Public />}
              iconPosition="start"
              label="World Statistics"
              {...a11yProps(2)}
            />
            <Tab
              sx={{
                minHeight: '42px',
                p: '9px',
              }}
              icon={<ThumbUp />}
              iconPosition="start"
              label="Actions"
              {...a11yProps(3)}
            />
          </Tabs>

          <IconButton onClick={toggleDrawer}>
            {open ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
        </Box>

        <Box
          sx={{
            display: 'flex',
            flex: '1 1 0',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              overflow: 'auto',
            }}
          >
            <TabPanel value={value} index={0}>
              <SortingRoom game={game} />
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

          {/* TODO handle it */}
          {voiceChatId && <VoiceChat voiceChatId={voiceChatId} userId={data.authorizedUser.id} clientData={clientData} open={open} />}
        </Box>
      </Box>
    )
  );
};
