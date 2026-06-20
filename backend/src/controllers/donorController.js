const pool = require("../config/db");

exports.becomeDonor = async (req, res) => {
    try {

        const userId = req.user.userId;
        const {bloodGroup,gender} = req.body;
        const existingDonor = await pool.query(
                `
                SELECT *
                FROM donors
                WHERE user_id = $1
                `,
                [userId]
            );

        if (existingDonor.rows.length > 0) {
            return res.status(400).json({
                message: "Already registered as donor"
            });
        }
        const donor = await pool.query(
                `
                INSERT INTO donors
                (
                    user_id,
                    blood_group,
                    gender
                )
                VALUES
                ($1,$2,$3)
                RETURNING *
                `,
                [
                    userId,
                    bloodGroup,
                    gender
                ]
            );

        res.status(201).json({
            message: "Donor profile created",
            donor: donor.rows[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }
};


exports.getMyDonorProfile = async (req, res) => {

    try {

        const userId = req.user.userId;
        const donor = await pool.query(
                `
                SELECT d.*,u.name,u.email,u.phone,u.city
                FROM donors d
                JOIN users u
                ON d.user_id = u.id
                WHERE d.user_id = $1
                `,[userId]
            );

        if (donor.rows.length === 0) {
            return res.status(404).json({
                message: "Donor profile not found"
            });
        }

        res.json(donor.rows[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });
    }
};