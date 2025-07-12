import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const peerConnection = new RTCPeerConnection();
const remoteVideo = document.getElementById('remoteVideo');

peerConnection.ontrack = event => {
  remoteVideo.srcObject = event.streams[0];
};

onValue(ref(db, 'webrtc/offer'), async snapshot => {
  const offer = snapshot.val();
  if (offer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    set(ref(db, 'webrtc/answer'), answer);
  }
});
