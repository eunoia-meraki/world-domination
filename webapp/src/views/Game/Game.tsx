// /* eslint-disable react/button-has-type */
// /* eslint-disable @typescript-eslint/restrict-template-expressions */
// /* eslint-disable @typescript-eslint/no-unsafe-assignment */
// /* eslint-disable @typescript-eslint/no-unsafe-call */
// import { Link } from 'react-location';
// // import { graphql } from 'react-relay';
// // import { v4 } from 'uuid';

// import { FC, useEffect, useRef, useState } from 'react';

// // const voiceChatCoordinatorSubscription = graphql`
// //   subscription VoiceChatCoordinatorSubscription($input: FeedbackLikeSubscribeData!) {
// //     feedback_like_subscribe(data: $input) {
// //       feedback {
// //         id
// //         like_count
// //       }
// //     }
// //   }
// // `;

// export const Game: FC = () => {
//   const [rooms, updateRooms] = useState([]);
//   const rootNode = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     updateRooms(rooms);
//     // socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
//     //   if (rootNode.current) {
//     //     updateRooms(rooms);
//     //   }
//     // });
//   }, []);

//   return (
//     <div ref={rootNode}>
//       <h1>Available Rooms</h1>

//       <ul>
//         {rooms.map(roomID => (
//           <li key={roomID}>
//             {roomID}
//             <Link to={`/room/${roomID}`} />
//           </li>
//         ))}
//       </ul>

//       {/* <Link to={`/room/${v4()}`} title='Create New Room'/> */}
//     </div>
//   );};

import { Box } from '@mui/material';

import type { FC } from 'react';
import { useState } from 'react';

import { Content } from './Content';
import { Navigation } from './Navigation';

import { Contents } from '@/enumerations';

export const Game: FC = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [content, setContent] = useState<Contents>(Contents.ConferenceHall);

  const toggleOpen = (): void => {
    setOpen(!open);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
      }}
    >
      <Navigation open={open} setContent={setContent} content={content}/>

      <Content toggleOpen={toggleOpen} content={content} open={open} />
    </Box>
  );
};
