import graphql from 'babel-plugin-relay/macro';
import freeice from 'freeice';

import { useEffect, useRef, useCallback } from 'react';
import { useSubscription } from 'react-relay';
import type internal from 'stream';

import useStateWithCallback from './useStateWithCallback';
import type { useWebRTC_SuperpollingSubscription } from './__generated__/useWebRTC_SuperpollingSubscription.graphql';

export const LOCAL_VIDEO = 'LOCAL_VIDEO';

const ACTIONS = {
  JOIN: 'join',
  LEAVE: 'leave',
  SHARE_ROOMS: 'share-rooms',
  ADD_PEER: 'add-peer',
  REMOVE_PEER: 'remove-peer',
  RELAY_SDP: 'relay-sdp',
  RELAY_ICE: 'relay-ice',
  ICE_CANDIDATE: 'ice-candidate',
  SESSION_DESCRIPTION: 'session-description',
};

const voiceChatSubscription = graphql`
  subscription useWebRTC_SuperpollingSubscription {
    superpolling {
      actionType
      data
    }
  }
`;

type PeerDict = { [key: string]: RTCPeerConnection }

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

  const relayIce = (peerId: string, iceCandidate: RTCIceCandidate) => {
    // TODO Mutation with parametr ACTIONS.RELAY_ICE,
  };

  const relaySdp = (peerId: string, offer: RTCSessionDescriptionInit) => {
    // TODO Mutation with parametr ACTIONS.RELAY_SDP,
  };

  const relaySdpAnsw = (peerId: string, answer: RTCSessionDescriptionInit) => {
    // TODO Mutation with parametr ACTIONS.RELAY_SDP,
  };

  const join = (roomId: string) => {
    // TODO join mutation JOIN
  };

  const handleNewPeer = async (createOffer: string, to: string[]) => {
    // if (peerID in peerConnections.current) {
    //   return console.warn(`Already connected to peer ${peerID}`);
    // }
    if (to.includes(userId)) {
      peerConnections.current[userId] = new RTCPeerConnection({ iceServers: freeice() });
      peerConnections.current[userId].onicecandidate = event => {
        if (event.candidate) {
          relayIce(userId, event.candidate);
        }
      };
    }

    let tracksNumber = 0;
    peerConnections.current[userId].ontrack = ({ streams: [remoteStream] }) => {
      tracksNumber++;

      if (tracksNumber === 2) { // video & audio tracks received
        tracksNumber = 0;
        addNewClient(userId, () => {
          const peerMedia = peerMediaElements.current[userId];
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
      peerConnections.current[userId].addTrack(track, localMediaStream.current!);
    });

    if (userId === createOffer) {
      const offer = await peerConnections.current[userId].createOffer();

      await peerConnections.current[userId].setLocalDescription(offer);

      relaySdp(userId, offer);
    }
  };

  const setRemoteMedia = async (peerID: string, remoteDescription: string) => {
    const rd = JSON.parse(remoteDescription) as { readonly sdp: string, readonly type: RTCSdpType };
    await peerConnections.current[peerID]?.setRemoteDescription(
      new RTCSessionDescription(rd),
    );

    if (rd.type === 'offer') {
      const answer = await peerConnections.current[peerID].createAnswer();

      await peerConnections.current[peerID].setLocalDescription(answer);

      relaySdpAnsw(peerID, answer);

    }
  };

  const addIceCandidate = (peerID: string, iceCandidate: RTCIceCandidateInit) => {
    peerConnections.current[peerID]?.addIceCandidate(
      new RTCIceCandidate(iceCandidate),
    );
  };

  const handleRemovePeer = (peerID: string) => {
    if (peerConnections.current[peerID]) {
      peerConnections.current[peerID].close();
    }

    delete peerConnections.current[peerID];
    delete peerMediaElements.current[peerID];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateClients((list: any[]) => list.filter(c => c !== peerID));
  };

  useSubscription<useWebRTC_SuperpollingSubscription>({
    subscription: voiceChatSubscription,
    variables: {},
    onCompleted: () => console.log('onCompleted'),
    onError: e => console.log('onError', e),
    onNext: response => {
      switch (response?.superpolling.actionType) {
        case 'ADD_PEER': {
          handleNewPeer('createOffer', ['peerId', 'peerId']);
          break;
        }
        case 'SESSION_DESCRIPTION': {
          setRemoteMedia('peerId', 'remoteDesc');
          break;
        }
        case 'ICE_CANDIDATE': {
          addIceCandidate('peerId', {});
          break;
        }
        case 'REMOVE_PEER': {
          handleRemovePeer('peerId');
        }

      }
      console.log('onNext', response?.superpolling);
    },
  },
  );

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

    startCapture()
      .then(() => join('roomId'))
      .catch(e => console.error('Error getting userMedia:', e));

    return () => {
      localMediaStream.current.getTracks().forEach((track: { stop: () => any; }) => track.stop());

      // socket.emit(ACTIONS.LEAVE);
    };
  }, [roomID]);

  const provideMediaRef = useCallback((id, node) => {
    peerMediaElements.current[id] = node;
  }, []);

  return {
    clients,
    provideMediaRef,
  };
}
