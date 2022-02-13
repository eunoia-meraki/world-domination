declare module 'freeice' {
  const content: RTCIceServer[];
  export default (): RTCIceServer[] => content;
}
