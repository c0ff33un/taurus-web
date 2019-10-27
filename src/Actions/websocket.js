const WS_CONNECT = 'WS_CONNECT';
const WS_CONNECTING = 'WS_CONNECTING';
const WS_CONNECTED = 'WS_CONNECTED';
const WS_DISCONNECT = 'WS_DISCONNECT';
const WS_DISCONNECTED = 'WS_DISCONNECTED';

export const wsConnect = host => ({ type: WS_CONNECT, host });
export const wsConnecting = host => ({ type: WS_CONNECTED, host });
export const wsConnected = host => ({ type: WS_CONNECTED, host });
export const wsDisconnect = host => ({ type: WS_DISCONNECT, host });
export const wsDisconnected = host => ({ type: WS_DISCONNECTED, host });
