/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Link } from 'react-location';
// import { graphql } from 'react-relay';
// import { v4 } from 'uuid';

import { FC, useEffect, useRef, useState } from 'react';

// const voiceChatCoordinatorSubscription = graphql`
//   subscription VoiceChatCoordinatorSubscription($input: FeedbackLikeSubscribeData!) {
//     feedback_like_subscribe(data: $input) {
//       feedback {
//         id
//         like_count
//       }
//     }
//   }
// `;

export const Game: FC = () => {
  const [rooms, updateRooms] = useState([]);
  const rootNode = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    updateRooms(rooms);
    // socket.on(ACTIONS.SHARE_ROOMS, ({ rooms = [] } = {}) => {
    //   if (rootNode.current) {
    //     updateRooms(rooms);
    //   }
    // });
  }, []);

  return (
    <div ref={rootNode}>
      <h1>Available Rooms</h1>

      <ul>
        {rooms.map(roomID => (
          <li key={roomID}>
            {roomID}
            <Link to={`/room/${roomID}`} />
          </li>
        ))}
      </ul>

      {/* <Link to={`/room/${v4()}`} title='Create New Room'/> */}
    </div>
  );};
