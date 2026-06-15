const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/shopify-order", async (req, res) => {
    console.log("Yeni Sipariş");
    console.log(JSON.stringify(req.body, null, 2));

    res.status(200).send("OK");
});

app.get("/", (req, res) => {
    res.send("Çalışıyor");
});

app.get("/ara", async (req, res) => {
    try {

        const result = await axios.post(
            "https://rema.butiksistem.com/rest/product/get",
            {
                auth: {
                    userName: process.env.BUTIK_USER,
                    password: process.env.BUTIK_PASS
                },
                arguments: {},
                responseType: "json"
            }
        );

        res.json(result.data);

    } catch (err) {

        console.error("HATA:", err.response?.data || err.message);

        res.status(500).json({
            error: err.message,
            details: err.response?.data || null
        });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server çalışıyor");
});
