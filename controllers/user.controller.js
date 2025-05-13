const User = require("../models/models.users");

const getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select("-password");

        if(!users){
            return res.status(404).json({
                message : "No users found",
            })
        }
        res.json({
            data : users,
            message : "Users retrieved successfully",
        })
    }catch (error) {
        res.status(500).json({
            message : error.message || "Something went wrong",
        })
    }

}
const getUser = async (req, res) => {
    try{
        const user = await User.findById(req.params.id).select("-password");

        if(!user){
            return res.status(404).json({
                message : "No user found",
            })
        }
        res.json({
            data : user,
            message : "User retrieved successfully",
        })
    }catch (error) {
        res.status(500).json({
            message : error.message || "Something went wrong",
        })
    }

}

module.exports = {
    getAllUsers,
    getUser,
}