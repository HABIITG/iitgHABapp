const { QR } = require('./qrModel.js');

const createQR = async (req, res) => {
    try {
        const qr = await QR.create(req.body);

        res.status(200).json({message: "QR created", qr});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error occured"});
    }
}

const checkScanned = async (req, res) => {
    const {qr_string} = req.body;
    try {
        const qr = await QR.findOne({'qr_string': qr_string});

        if (!qr) {
            return res.status(404).json({message: "QR not found"});
        }
        if (qr.is_scanned) {
            return res.status(400).json({message: "QR already scanned"});
        }

        qr.is_scanned = true;
        qr.scanned_at = new Date();

        await qr.save();

        res.status(200).json({message: "QR scanned successfully"})
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error occured"});
    }
};

module.exports = {
    createQR,
    checkScanned
}