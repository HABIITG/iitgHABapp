const Complaint = require('../complaint/complaintModel');
const Item = require('./itemModel');

const getComplaintsOfItemsByHostel = async (req, res) => {
    const { hostel } = req.params;
    try {
        const complaints = await Item.find({ 'hostel': hostel }, 'complaints'); // Gets only the complaints of all items in a hostel
        res.status(200).json(complaints);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching complaints' });
    }
    
}; // This function may be used by hab to get the complaints of all items in a hostel or by secy to get all complaints of all items in their hostel


const getItemsWithComplaints = async (req, res) => {
    const { hostel } = req.params;

    try {
        const itemsWithComplaints = await Item.find({
          $and: [  
            {'hostel': hostel},
         //   { $or: [{'status': 'submitted'}, {'status': 'in_progress'}]}
        ]
    }); // fetches only those items which have a status as in_progress or submitted;

        res.status(200).json(itemsWithComplaints);

    } catch (err) {
        res.status(500).json({message: 'Error fetching items'});
    }
    
};

const getItemsForHAB = async (req, res) => {
    const { hostel } = req.params;

    try {
        const itemsWithHAB = await Item.find({
            $and: [
                {'hostel': hostel},
                {'currentAuthority': 'hab'}
            ]
        });

        res.status(200).json(itemsWithHAB);
    } catch (err) {
        res.status(500).json({message: 'Error fetching items for HAB'});
    }
};

const createItem = async (req, res) => {
    try {
        const item = await Item.create(req.body);
        res.status(201).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Error creating item', error: err });
        console.log(err);
    }
};

const deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedItem = await Item.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(deletedItem);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting item' });
    }
};

const updateItem = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByIdAndUpdate(id, req.body, { new: true });

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: 'Error updating item' });
    }
};
const getItems = async (req, res) => {
    try {
        const items = await Item.find({});
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching items' });
    }
};

const getItem = async (req, res) => {
    const { qr } = req.params;
    if (!qr) {
        return res.status(400).json({ message: 'QR code is required' });
    }
    //console.log("qrcode is:", qr);
    try {
        const item = await Item.findOne({qrCode: qr}).populate('complaints');
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(item);
        //console.log("item is:", item);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching item' });
    }
}

const resolveItem = async (req, res) => {
    const { itemId } = req.params;

    //console.log(itemId);

    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required'} );
    }

    try {
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found'} ); 
        }

        await Complaint.updateMany(
            { _id: { $in: item.complaints }},
            { status: 'resolved' }
        );

        item.status = 'resolved';

        item.complaints = [];

        await item.save();

        res.status(200).json({
            message: 'Item resolved successfully',
            item
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error occured in resolving item' });
    }
};

const inProgressItem = async (req, res) => {
    const { itemId } = req.params;

    if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required'} );
    }

    try {
        const item = await Item.findById(itemId);

        if (!item) {
            return res.status(404).json({ message: 'Item not found'} ); 
        }

        await Complaint.updateMany(
            { _id: { $in: item.complaints }},
            { status: 'in_progress' }
        );

        item.status = 'in_progress';

        item.complaints = [];

        await item.save();

        res.status(200).json({
            message: 'Item in progress successfully',
            item
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Error occured in in progress item' });
    }
};

module.exports = {
    getComplaintsOfItemsByHostel,
    createItem,
    deleteItem,
    updateItem,
    getItems,
    getItem,
    getItemsWithComplaints,
    getItemsForHAB,
    resolveItem,
    inProgressItem
};