function isEligible(
    gender,
    lastDonationDate
) {
    if (!lastDonationDate) {
        return true;
    }

    const today = new Date();

    const donationDate = new Date(lastDonationDate);

    const diffDays =
        Math.floor(
            (today - donationDate) /
            (1000 * 60 * 60 * 24)
        );

    if (gender.toLowerCase() === "male") {
        return diffDays >= 90;
    }

    return diffDays >= 120;
}

module.exports = isEligible;