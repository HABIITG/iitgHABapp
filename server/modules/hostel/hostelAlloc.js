// upload.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Import Mongoose Models
const Student = require('hostelAllocModel');
const {Hostel} = require('./hostelModel');

const CSV_FILE_PATH = path.join(__dirname, 'data.csv');

// --- Main Upload Function ---
async function uploadData() {
    try {
        const results = [];
        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                console.log(`Finished reading CSV file. Found ${results.length} rows.`);

                // 2. Process each row from the CSV
                for (const row of results) {
                    const { rollno, hostelName } = row;

                    if (!rollno || !hostelName) {
                        console.warn('Skipping invalid row:', row);
                        continue;
                    }

                    try {
                        
                        const hostel = await Hostel.findOneAndUpdate(
                            { name: hostelName.trim() },
                            { $setOnInsert: { name: hostelName.trim() } },
                            { upsert: true, new: true, runValidators: true }
                        );


                        await Student.findOneAndUpdate(
                            { rollNo: rollno.trim() },
                            {
                                rollno: rollno.trim(),
                                hostel: hostel._id // Link to the hostel's ObjectId
                            },
                            { upsert: true, new: true, runValidators: true }
                        );
                        
                        console.log(`Processed roll no: ${rollno}`);

                    } catch (err) {
                        console.error(`Error processing roll no ${rollno}:`, err.message);
                    }
                }
                console.log('Data upload process completed.');
            });

    } catch (error) {
        console.error('Failed to connect to MongoDB or run script:', error);
        process.exit(1);
    }
}

uploadData();