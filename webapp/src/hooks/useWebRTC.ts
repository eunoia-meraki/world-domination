/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { RelayEnvironment } from '@/RelayEnvironment';
import graphql from 'babel-plugin-relay/macro';
import freeice from 'freeice';

import { useEffect, useRef, useCallback } from 'react';
import { Disposable, requestSubscription, useMutation } from 'react-relay';

import useStateWithCallback from './useStateWithCallback';
import type { useWebRTC_interactWebRTCMutation } from './__generated__/useWebRTC_interactWebRTCMutation.graphql';
import type { useWebRTC_WebRTCSubscription } from './__generated__/useWebRTC_WebRTCSubscription.graphql';

export const LOCAL_VIDEO = 'LOCAL_VIDEO';

const voiceChatSubscription = graphql`
  subscription useWebRTC_WebRTCSubscription {
    webRTC {
      actionType
      data
    }
  }
`;

const interactWebRTCMutation = graphql`
  mutation useWebRTC_interactWebRTCMutation($actionType: ActionType!, $data: String!){   
    interactWebRTC(actionType: $actionType, data: $data) 
  }
`;

type PeerDict = { [key: string]: RTCPeerConnection }

type SessionDescriptionDict = { [key: string]: RTCSessionDescriptionInit }

type IceCandidateDict = { [key: string]: RTCIceCandidate }

type MediaObjectDict = {
  [key: string]: {
    srcObject: MediaStream,
    volume: number,
  } | null
};

export default function useWebRTC(roomID: string) {
  const [clients, updateClients] = useStateWithCallback([]);
  const userId = localStorage.getItem('userId') || '';

  const addNewClient = useCallback((newClient, cb) => {
    updateClients((list: unknown[]) => {
      if (!list.includes(newClient)) {
        return [...list, newClient];
      }

      return list;
    }, cb);
  }, [clients, updateClients]);

  const peerConnections = useRef<PeerDict>({});
  const localMediaStream = useRef<any>(null);
  const peerMediaElements = useRef<MediaObjectDict>({
    [LOCAL_VIDEO]: null,
  });

  const [interactWebRTC] = useMutation<useWebRTC_interactWebRTCMutation>(
    interactWebRTCMutation,
  );

  const relayIce = (icd: IceCandidateDict) => {
    if (Object.keys(icd).length === 0) {
      return;
    }

    console.log('relayIce', icd);
    interactWebRTC({
      variables: {
        actionType: 'RELAY_ICE',
        data: JSON.stringify(icd),
      },
    });
  };

  const relaySdp = (sdd: SessionDescriptionDict) => {
    if (Object.keys(sdd).length === 0) {
      return;
    }

    console.log('relaySdp', sdd);
    interactWebRTC({
      variables: {
        actionType: 'RELAY_SDP',
        data: JSON.stringify(sdd),
      },
    });
  };

  const subscriptionResolvers: { [key: string]: (data: any) => void} = {
    ['ADD_PEER']: async ({ offerCreator, to }: { offerCreator: string, to: string[] }) => {
      const createRTCPeerConnection = (acceptor: string) => {
        peerConnections.current[acceptor] = new RTCPeerConnection({
          iceServers: freeice(),
        });

        peerConnections.current[acceptor].onicecandidate = e => {
          if (e.candidate) {
            relayIce({ [acceptor]: e.candidate });
          }
        };

        let tracksNumber = 0;
        peerConnections.current[acceptor].ontrack = ({ streams: [remoteStream] }) => {
          tracksNumber++;

          if (tracksNumber === 2) { // video & audio tracks received
            tracksNumber = 0;
            addNewClient(acceptor, () => {
              const peerMedia = peerMediaElements.current[acceptor];
              if (peerMedia !== null) {
                peerMedia.srcObject = remoteStream;
              } else {
                // FIX LONG RENDER IN CASE OF MANY CLIENTS
                let settled = false;
                const interval = setInterval(() => {
                  if (peerMedia !== null) {
                    (peerMedia as { srcObject: MediaStream }).srcObject = remoteStream;
                    settled = true;
                  }

                  if (settled) {
                    clearInterval(interval);
                  }
                }, 1000);
              }
            });
          }
        };

        localMediaStream.current?.getTracks().forEach((track: MediaStreamTrack) => {
          peerConnections.current[acceptor].addTrack(track, localMediaStream.current!);
        });
      };

      if (userId === offerCreator) {
        const sdd: SessionDescriptionDict = {};

        await Promise.all(to.map(async acceptor => {
          createRTCPeerConnection(acceptor);
          sdd[acceptor] = await peerConnections.current[acceptor].createOffer();
          peerConnections.current[acceptor].setLocalDescription(sdd[acceptor]);
        }));

        relaySdp(sdd);
      } else {
        if (offerCreator in peerConnections.current) {
          console.warn(`Peer ${offerCreator} already connected`);
        }

        createRTCPeerConnection(offerCreator);
      }
    },

    ['SESSION_DESCRIPTION']: async ({ creator, sdd }: { creator: string, sdd: SessionDescriptionDict }) => {
      const sd: RTCSessionDescriptionInit | undefined = sdd[userId];

      if (sd) {
        await peerConnections.current[creator].setRemoteDescription(
          new RTCSessionDescription(sd),
        );

        if (sd.type === 'offer') {
          const answer = await peerConnections.current[creator].createAnswer();

          await peerConnections.current[creator].setLocalDescription(answer);

          relaySdp({ [creator]: answer });
        }
      }
    },

    ['ICE_CANDIDATE']: ({ creator, icd }: { creator: string, icd: IceCandidateDict }) => {
      const ic = icd[userId];
      if (ic) {
        const some = new RTCIceCandidate(ic);
        peerConnections.current[creator].addIceCandidate(
          some,
        );
      }
    },

    ['REMOVE_PEER']: ({ disconnected }: { disconnected: string}) => {
      if (userId === disconnected) {
        console.warn(`REMOVE_PEER: Can't disconnect myself ${disconnected}`);
        return;
      }

      peerConnections.current[disconnected]?.close();
      delete peerConnections.current[disconnected];
      delete peerMediaElements.current[disconnected];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      updateClients((list: any[]) => list.filter(c => c !== disconnected));
    },
  };

  useEffect(() => {
    async function startCapture() {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          width: 1280,
          height: 720,
        },
      });

      addNewClient(LOCAL_VIDEO, () => {
        const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];

        if (localVideoElement) {
          localVideoElement.volume = 0;
          localVideoElement.srcObject = localMediaStream.current;
        }
      });
    }

    let subscription: Disposable | null = null;

    startCapture()
      .then(() => {
        subscription = requestSubscription<useWebRTC_WebRTCSubscription>(
          RelayEnvironment,
          {
            subscription: voiceChatSubscription,
            variables: {},
            onCompleted: () => console.log('established'),
            onError: e => console.error(e),
            onNext: response => {
              if (response?.webRTC) {
                const { actionType, data } = response.webRTC;
                console.log(actionType, response);
                subscriptionResolvers[actionType] && subscriptionResolvers[actionType](JSON.parse(data));
              }
            },
          },
        );
      })
      .catch(e => console.error('Error getting userMedia:', e));

    return () => {
      localMediaStream.current.getTracks().forEach((track: { stop: () => any; }) => track.stop());
      subscription?.dispose();
    };
  }, [roomID]);

  const provideMediaRef = useCallback((id, node) => {
    peerMediaElements.current[id] = node;
  }, []);

  return {
    clients: clients as string[],
    provideMediaRef,
  };
}
