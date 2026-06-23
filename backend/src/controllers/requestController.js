const pool = require("../config/db");
const findMatchingDonors = require("../services/matchingService");

exports.createBloodRequest = async (req, res) => {

    try {
        const userId = req.user.userId;
        const {
            patientName,
            bloodGroupNeeded,
            unitsNeeded,
            hospitalName,
            latitude,
            longitude,
            urgency
        } = req.body;

        const request = await pool.query(
            `
            INSERT INTO blood_requests
            (
                user_id,
                patient_name,
                blood_group_needed,
                units_needed,
                hospital_name,
                latitude,
                longitude,
                urgency
            )
            VALUES
            ($1,$2,$3,$4,$5,$6,$7,$8)
            RETURNING *
            `,
            [
                userId,
                patientName,
                bloodGroupNeeded,
                unitsNeeded,
                hospitalName,
                latitude,
                longitude,
                urgency
            ]
        );

        const matches = await findMatchingDonors(bloodGroupNeeded,latitude,longitude);


       res.status(201).json({
            message:
                "Blood request created",

            request:
                request.rows[0],

            matchedDonors:
                matches.slice(0, 10)
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:"Server Error"
        });

    }

};