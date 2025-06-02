const User = require("../models/models.users");
const { sendEmail, generateOTP } = require("../middlewares/nodemailer.middleware");

const resendOTP = async (req, res) => {
    const { email } = req.body;

    try {

        const user = await User.findOne(email);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                message: "User is already verified",
            });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;


        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        await sendEmail(user.email, "Resend OTP", `Your OTP is: ${otp}`);

        return res.status(200).json({
            message: "OTP resent successfully",
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isVerified: user.isVerified,
            otpExpires: user.otpExpires,
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Something went wrong",
        });
    }
}

module.exports = resendOTP;