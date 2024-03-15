
const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const app = express();
const cors = require('cors');
const sharp = require('sharp');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const firebaseConfig = {
    apiKey: "",
    authDomain: "my-pos-700.firebaseapp.com",
    projectId: "my-pos-700",
    storageBucket: "my-pos-700.appspot.com",
    messagingSenderId: "1063966004743",
    appId: "1:1063966004743:web:189780be5ec080184c7ca2",
    measurementId: "G-VFZT08WH1J"
  };
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

var omise = require('omise')({
    'secretKey': '',
    'omiseVersion': '2019-05-29'
});

app.use(cors)


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

const createCharge = (sourceId, amount, userId) => {
    return new Promise((resolve, reject) => {
        omise.charges.create({
            amount: (amount * 100),
            currency: 'THB',
            source: sourceId,
            metadata: {
                userId
            },
        }, (err, resp) => {
            if (err) {
                return reject(err)

            }
            resolve(resp)
        })
    })
}

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('message', (data) => {
        console.log('Received:', data);
        socket.emit('message', 'Server received: ' + data);

    });
    socket.on('QR', async (data) => {
        try{
            console.log(data)
            const omiseResponse = await createCharge(data.sourceId, data.amount)
        if (omiseResponse) {
            const sourceId = data.sourceId
            const chargeId = omiseResponse.id
            console.log(omiseResponse)
            const download_url = omiseResponse.source.scannable_code.image.download_uri
            console.log('dowload url', download_url)

            const topupRef = doc(db, 'topups', sourceId);
            await setDoc(topupRef, {
                chargeId : omiseResponse.id,
                status: 'pending',
                type: 'promptpay',
                amount: data.amount
            });
            const image = await sharp(download_url).toBuffer();
            const code = image.toString('base64');
            socket.emit('show QR', code)
        }


        }catch(error){
            console.log(error)
        }
        
    })
    io.on('CARD', async(data)=>{
        try{
            const amount = data
            socket.emit('Get-Card')

            socket.on('card-from-esp', async(data) =>{
                console.log(data)
              const charge = await omise.charges.create({
                    amount: amount,
                    currency: "thb",
                    card: customer.cards.find_by(data).omise_id
                  })

                  if(charge.status === 'successful'){
                    socket.emit('card-success')
                  }

            })
        }catch(error){
            console.log(error)
        }
    })

});

app.post('/cancel', async (req, res) => {
    console.log('test cancel')

    const sourceId = req.body.source

    try {
        const topupRef = db.collection('topups').doc(sourceId)
        await topupRef.delete()
        res.json({
            status: 'success'
        })


    } catch (error) {
        console.log('Cancel promtpay error uid :', userId, error)
    }

})

app.post('/check', async (req, res) => {
    console.log('test check', req.body)
    const sourceId = req.body.source

    try {
        const topupRef = doc(db, 'topups', sourceId);
        const topupSnap = await topupRef.get()
        const topupData = topupSnap.data()

        console.log(topupData)
        if (!topupSnap.exists) {
            res.json({
                status: 'not exists',
            })
        }
        else if (topupData.status === 'successful') {
            res.json({
                status: 'successful',
                amount: topupData.amount
            })



        }
        else if (topupData.status === 'failed') {
            await topupRef.delete()
            res.json({
                status: 'failed',
            })
        }


        else {
            res.json({
                status: 'pending',
            })
        }

    } catch (error) {
        console.error('Check promptpay error:', error);
        res.status(500).json({
            status: 'error',
            error: error.message,
        });
    }
})


app.post('/webhook', async (req, res) => {
    console.log('webhook body ', req)
    if (req.body.key === 'charge.complete') {
        try {
            const webhookData = req.body.data
            const sourceId = webhookData.source.id
            const chargeId = webhookData.id
            const statusCharge = webhookData.status

            const topupRef = doc(db, 'topups', sourceId);
            const topupSnap = await topupRef.get()
            const topupData = topupSnap.data()

            if (topupData.chargeId !== chargeId) {
                throw new Error('ChargeID !== wehbook.chargeId')
            }
            if (topupData.status === 'pending') {
                await updateDoc(topupRef ,
                    {
                    status: statusCharge
                })


            }
        } catch (error) {
            console.log(error)
        }

    }
})
app.get('/test', (req, res) =>{
    res.json({
        msg: 'Hello'
    })
})


app.post('/promptpay', async (req, res) => {
    try {
        const sourceId = req.body.source
        const sourceAmount = req.body.amount
        const omiseResponse = await createCharge(sourceId, sourceAmount)
        if (omiseResponse) {
            console.log(omiseResponse)
            const chargeId = omiseResponse.id
            const download_url = omiseResponse
            await db.collection("topups").doc(sourceId).set({
                chargeId,
                amount: parseInt(sourceAmount),
                status: 'pending',
                type: 'promptpay'
            })
            res.json({
                image_url: download_url.source.scannable_code.image.download_uri
            })
        }

    } catch (error) {
        console.log(error)
        res.status(404).json({
            error: 'Payment cancel'

        })
    }

})

const SOCKET_PORT = 3001;
io.listen(SOCKET_PORT);

server.listen(3000, () => {
    console.log(`server running on port $3001`);
});