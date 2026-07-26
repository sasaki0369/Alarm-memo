/* ============================================================
   firebase-messaging-sw.js
   ロック中・アプリを閉じている間にプッシュ通知を表示するための
   Service Worker です。index.html と同じフォルダに置いてください。

   ※ firebaseConfig は index.html 内のものと同じ値に揃えてください。
============================================================ */
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAMIGXrZ6pM1WxwdaIT--y6YmK7ptwRr5k",
  authDomain: "alarm-memo.firebaseapp.com",
  databaseURL: "https://alarm-memo-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "alarm-memo",
  storageBucket: "alarm-memo.firebasestorage.app",
  messagingSenderId: "970940384153",
  appId: "1:970940384153:web:b3046640a8a52a81000908"
});

const messaging = firebase.messaging();

/* バックグラウンド（ロック中・アプリを閉じている間）にプッシュを受信した時の表示処理 */
messaging.onBackgroundMessage(payload => {
  const data = payload.data || {};
  const title = '🔔 アラームメモ';
  const options = {
    body: data.content || '',
    icon: undefined, // アイコンは省略（必要であればdata URIまたはファイルパスを指定可能）
    tag: 'alarm-memo-' + (data.alarmId || Date.now()),
    // Android Chromeはこのvibrateパターンでロック中でも振動します
    vibrate: [400, 200, 400, 200, 400],
    requireInteraction: true,
    data: data
  };
  self.registration.showNotification(title, options);
});

/* 通知をタップしたらアプリを開く／前面に出す */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow('./index.html');
    })
  );
});
