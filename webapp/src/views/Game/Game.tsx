/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Link } from 'react-location';
// import { graphql } from 'react-relay';
// import { v4 } from 'uuid';

import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';

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

      <Header open={open} toggleOpen={toggleOpen} content={content} />

      <Outlet />
    </Box>
  );
};
