import { interactWebRTCMutation } from './mutations';
import { webRtcSubscription } from './subscriptions';

export const includeWebRTC = () => ({
  webRtcSubscription,
  interactWebRTCMutation,
});
