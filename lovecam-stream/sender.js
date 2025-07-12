import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-database.js";
import { firebaseConfig } from './firebase-config.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const peerConnection = new RTCPeerConnection();

const localVideo = document.getElementById('localVideo');
document.getElementById('startBtn').onclick = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  localVideo.srcObject = stream;
  stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  set(ref(db, 'webrtc/offer'), offer);

  onValue(ref(db, 'webrtc/answer'), async snapshot => {
    const answer = snapshot.val();
    if (answer && !peerConnection.currentRemoteDescription) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }
  });
};
