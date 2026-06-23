const pool = require("../config/db");
const compatibility = require("../utils/bloodCompatibility");
const calculateDistance = require("../utils/distance"); 
const isEligible = require("../utils/isEligible");

async function findMatchingDonors(
    bloodGroupNeeded,
    requestLat,
    requestLon
) {

    const compatibleGroups = compatibility[bloodGroupNeeded];

    const donors = await pool.query(
            `
            SELECT
                d.*,
                u.name,
                u.phone,
                u.latitude,
                u.longitude,
                u.city
            FROM donors d
            JOIN users u
            ON d.user_id = u.id
            WHERE d.blood_group = ANY($1)
            `,
            [compatibleGroups]
        );

    const matches = [];

    for (const donor of donors.rows) {

        if (
            !isEligible(
                donor.gender,
                donor.last_donation_date
            )
        ) {
            continue;
        }

        const distance = calculateDistance(
                requestLat,
                requestLon,
                donor.latitude,
                donor.longitude
            );

        matches.push({
            donorId: donor.id,
            name: donor.name,
            phone: donor.phone,
            bloodGroup:
                donor.blood_group,
            city: donor.city,
            distance:
                Number(
                    distance.toFixed(2)
                )
        });
    }

    matches.sort(
        (a, b) =>
            a.distance - b.distance
    );

    return matches;
}

module.exports = findMatchingDonors;