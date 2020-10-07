import express from 'express';
import Expo from 'expo-server-sdk';

const app = express();
const expo = new Expo();

let savedPushTokens = [];
const PROT_NUMBER = 3000;

const saveToken = (token) => {
    if (savedPushTokens.indexOf(token) === -1) {
        savedPushTokens.push(token);
    }
}

const handlePushTokens = (message) => {
    let notifications = [];

    for (let pushToken of savedPushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
            console.log('에러!');
            continue;
        }

        notifications.push({
            to: pushToken,
            sound: 'default',
            title: '메시지 왔어',
            body: message,
            data: {message}
        });
    } 
    let chunks = expo.chuckPushNotifications(notifications);
    (async () => {
        for (let chunk of chunks) {
            try {
                let reseipts = await expo.sendPushNotificationAsync(chunk);
                console.log(reseipts);
            } catch (error) {
                console.error(error);
              }
        }
    })();
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('서버 실행');
});

app.post('/token', (req, res) => {
    saveToken(req.body.token.value);
    console.log('토큰 저장됨');
    res.send(`토큰이 저장되었습니다. ${req.body.token.value}`);
});

app.post('/message', (req, res) => {
    handlePushTokens(req.body.message);
    console.log('메시지 보냄');
    res.send(`메시지를 전송합니다. ${req.body.message}`);
});

app.listen(PROT_NUMBER, () => {
    console.log('3000번 포트로 서버 실행');
})