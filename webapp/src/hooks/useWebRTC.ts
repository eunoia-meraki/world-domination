import graphql from 'babel-plugin-relay/macro';
import freeice from 'freeice';
import { Disposable, requestSubscription, useMutation } from 'react-relay';

import { useEffect, useRef, useCallback } from 'react';

import useStateWithCallback, { StateUpdatedCallback } from './useStateWithCallback';

import type { useWebRTC_WebRTC_Subscription } from './__generated__/useWebRTC_WebRTC_Subscription.graphql';
import type { useWebRTC_interactWebRTC_Mutation } from './__generated__/useWebRTC_interactWebRTC_Mutation.graphql';

import { RelayEnvironment } from '@/RelayEnvironment';

const voiceChatSubscription = graphql`
  subscription useWebRTC_WebRTC_Subscription($roomId: String!) {
    webRTC(roomId: $roomId) {
      actionType
      data
    }
  }
`;

const interactWebRTCMutation = graphql`
  mutation useWebRTC_interactWebRTC_Mutation(
    $actionType: ActionType!
    $data: String!
  ) {
    interactWebRTC(actionType: $actionType, data: $data)
  }
`;

type HTMLMediaElementDictionary = {
  [key: string]: HTMLMediaElement | undefined;
};

type RTCPeerConnectionDictionary = {
  [key: string]: RTCPeerConnection;
};

type IceCandidateDictionary = {
  [key: string]: RTCIceCandidate;
};

type SessionDescriptionDictionary = {
  [key: string]: RTCSessionDescriptionInit;
};

type SessionDescriptionResponse = {
  creator: string;
  sdd: SessionDescriptionDictionary;
};

type AddPeerResponse = {
  offerCreator: string;
  to: string[];
};

type IceCandidateResponse = {
  creator: string;
  icd: IceCandidateDictionary;
};

type RemovePeerResponse = {
  disconnected: string;
};

// TODO use it

// type ResponseData = SessionDescriptionResponse
// | AddPeerResponse
// | IceCandidateResponse
// | RemovePeerResponse;

type SubscriptionResolvers = {
  [key: string]: (data: never) => void;
};

const getAudioIndicationGetter = (media: MediaStream) => {
  const audioContext = new AudioContext();
  const MESNode = audioContext.createMediaStreamSource(media);
  const analyserNode = audioContext.createAnalyser();
  MESNode.connect(analyserNode);
  const pcmData = new Float32Array(analyserNode.fftSize);

  const getIndication = () => {
    analyserNode.getFloatTimeDomainData(pcmData);
    const sumSquares = pcmData.reduce((acc, amplitude) => acc + amplitude ** 2, 0.0);
    const vol = (sumSquares / pcmData.length) ** 0.5;
    return vol;
  };

  return getIndication;
};

const debugPrint = (op:string, data: unknown) => {
  // eslint-disable-next-line no-console
  console.log(data);
};

export interface Client {
  clientId: string;
  audioIndicationGetter: () => number;
  setMuted: (muted: boolean) => void;
}

const useWebRTC = (roomID: string, userId: string) => {
  const [clients, updateClients] = useStateWithCallback<Client[]>([]);
  const HTMLMediaElements = useRef<HTMLMediaElementDictionary>({});
  const RTCPeerConnections = useRef<RTCPeerConnectionDictionary>({});
  const selfMediaStream = useRef<MediaStream | null>(null);
  // const audioIndicationGetters = useRef<AudioIndicationGetters>({});

  const addOneClient = useCallback((newClient: Client, cb: StateUpdatedCallback<Client[]>) => {
    updateClients(list => !list.includes(newClient) ? [...list, newClient] : list, cb);
  }, [updateClients]);

  const provideMediaRef = useCallback((peerId: string, htmlElement: HTMLMediaElement) => {
    HTMLMediaElements.current[peerId] = htmlElement;
  }, []);

  const [interactWebRTC] = useMutation<useWebRTC_interactWebRTC_Mutation>(
    interactWebRTCMutation,
  );

  useEffect(() => {
    const addSrcToPeerHTMLMediaElement = (
      peerId: string,
      mediaStream: MediaStream | null,
    ) => {
      // Try to add source while HTMLMediaElement not provided
      let settled = false;
      const interval = setInterval(() => {
        const htmlMediaElement = HTMLMediaElements.current[peerId];

        if (htmlMediaElement && mediaStream) {
          htmlMediaElement.srcObject = mediaStream;
          settled = true;
        }
        if (settled) {
          clearInterval(interval);
        }
      }, 1000);
    };

    const relayIce = (icDict: IceCandidateDictionary) => {
      if (Object.keys(icDict).length === 0) {
        return;
      }

      debugPrint('relayIce', icDict);

      interactWebRTC({
        variables: {
          actionType: 'RELAY_ICE',
          data: JSON.stringify(icDict),
        },
      });
    };

    const relaySdp = (sdDict: SessionDescriptionDictionary) => {
      if (Object.keys(sdDict).length === 0) {
        return;
      }

      debugPrint('relaySdp', sdDict);

      interactWebRTC({
        variables: {
          actionType: 'RELAY_SDP',
          data: JSON.stringify(sdDict),
        },
      });
    };

    const subscriptionResolvers: SubscriptionResolvers = {
      ADD_PEER: async ({ offerCreator, to }: AddPeerResponse) => {
        const createRTCPeerConnection = (acceptor: string) => {
          RTCPeerConnections.current[acceptor] = new RTCPeerConnection({
            iceServers: freeice(),
          });

          RTCPeerConnections.current[acceptor].onicecandidate = e => {
            if (e.candidate) {
              relayIce({ [acceptor]: e.candidate });
            }
          };

          let tracksNumber = 0;
          RTCPeerConnections.current[acceptor].ontrack = ({
            streams: [remoteMediaStream],
          }) => {
            tracksNumber += 1;
            // video & audio tracks received
            if (tracksNumber === 1) {// TODO set 2 in next version
              tracksNumber = 0;
              addOneClient(
                {
                  clientId: acceptor,
                  audioIndicationGetter: getAudioIndicationGetter(remoteMediaStream),
                  setMuted: muted => remoteMediaStream.getAudioTracks().forEach(track => {
                    const audio = track;
                    audio.enabled = muted;
                  }),
                },
                () => addSrcToPeerHTMLMediaElement(acceptor, remoteMediaStream),
              );
            }
          };

          selfMediaStream.current?.getTracks().forEach((track: MediaStreamTrack) => {
            RTCPeerConnections.current[acceptor].addTrack(track, selfMediaStream.current!);
          });
        };

        if (userId === offerCreator) {
          const sdd: SessionDescriptionDictionary = {};

          await Promise.all(
            to.map(async acceptor => {
              createRTCPeerConnection(acceptor);
              sdd[acceptor] = await RTCPeerConnections.current[acceptor].createOffer();
              await RTCPeerConnections.current[acceptor].setLocalDescription(sdd[acceptor]);
            }),
          );

          relaySdp(sdd);
        } else if (!(offerCreator in RTCPeerConnections.current)) {
          createRTCPeerConnection(offerCreator);
        }
      },

      SESSION_DESCRIPTION: async ({ creator,sdd }: SessionDescriptionResponse) => {
        const sd: RTCSessionDescriptionInit | undefined = sdd[userId];

        if (sd) {
          await RTCPeerConnections.current[creator].setRemoteDescription(
            new RTCSessionDescription(sd),
          );

          if (sd.type === 'offer') {
            const answer = await RTCPeerConnections.current[
              creator
            ].createAnswer();

            await RTCPeerConnections.current[creator].setLocalDescription(answer);

            relaySdp({ [creator]: answer });
          }
        }
      },

      ICE_CANDIDATE: async ({ creator, icd }: IceCandidateResponse) => {
        const ic = icd[userId];
        if (ic) {
          const some = new RTCIceCandidate(ic);
          await RTCPeerConnections.current[creator].addIceCandidate(some);
        }
      },

      REMOVE_PEER: ({ disconnected }: RemovePeerResponse) => {
        if (userId === disconnected) {
          debugPrint('REMOVE_PEER', `Can't disconnect myself ${disconnected}`);
          return;
        }

        RTCPeerConnections.current[disconnected]?.close();
        delete RTCPeerConnections.current[disconnected];
        delete HTMLMediaElements.current[disconnected];
        updateClients(activeClients => activeClients.filter(c => c.clientId !== disconnected));
      },
    };

    let subscription: Disposable | null = null;

    navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false, // TODO pass true in next version
    }).then(mediaStream => {
      selfMediaStream.current = mediaStream;
      addOneClient(
        {
          clientId: userId,
          audioIndicationGetter: getAudioIndicationGetter(mediaStream),
          setMuted: muted => mediaStream.getAudioTracks().forEach(track => {
            const audio = track;
            audio.enabled = muted;
          }),
        },
        () => addSrcToPeerHTMLMediaElement(userId, mediaStream),
      );
    }).catch(() => {
      debugPrint('getUserMedia', 'error');
    }).then(() => {
      subscription = requestSubscription<useWebRTC_WebRTC_Subscription>(
        RelayEnvironment,
        {
          subscription: voiceChatSubscription,
          variables: {
            roomId: roomID,
          },
          onError: e => debugPrint('voiceChatSubscription', e),
          onNext: response => {
            if (response?.webRTC) {
              const { actionType, data } = response.webRTC;

              debugPrint(actionType, response);

              if (subscriptionResolvers[actionType]) {
                subscriptionResolvers[actionType](JSON.parse(data) as never);
              }
            }
          },
        },
      );
    }).catch(() => {
      debugPrint('voiceChatSubscription', 'something happend?!?!');
    });

    return () => {
      selfMediaStream.current?.getTracks().forEach(track => track.stop());
      subscription?.dispose();
    };
  }, [userId, roomID, addOneClient, interactWebRTC, updateClients]);

  return {
    clients ,
    provideMediaRef,
  };
};

export default useWebRTC;
