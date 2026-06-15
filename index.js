const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

app.post("/shopify-order", async (req, res) => {

    console.log("========== SIPARIS ==========");

    console.log("ODEME:");
    console.log(req.body.financial_status);

    console.log("MUSTERI:");
    console.log(JSON.stringify(req.body.customer, null, 2));

    console.log("ADRES:");
    console.log(JSON.stringify(req.body.shipping_address, null, 2));

    console.log("URUNLER:");
    console.log(JSON.stringify(req.body.line_items, null, 2));

    console.log("KARGO:");
    console.log(JSON.stringify(req.body.shipping_lines, null, 2));

    res.status(200).json({ success: true });
});

app.get("/", (req, res) => {
    res.send("Çalışıyor");
});

app.get("/tumurunler", async (req, res) => {
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

        res.json(result.data.result.data);

    } catch (err) {
        res.status(500).json(err.response?.data || err.message);
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server çalışıyor");
});
