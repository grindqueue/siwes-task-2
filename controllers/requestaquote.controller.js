const mongoose = require("mongoose");
const RequestaQuote = require("../models/models.requestaQuote");

const createRequestaQuote = async (req, res) => {
    try {
        const { name, email, phoneNumber, projectType, estimatedBudget, maximumTime, companyName, requiredSkills, country } = req.body;
        const requestaQuote = await RequestaQuote.create({ name, email, phoneNumber, projectType, estimatedBudget, maximumTime, companyName, requiredSkills, country });
        if (!requestaQuote) {
            return res.status(400).json({
                message: "Unable to create request a quote",
            });
        }
        res.status(201).json({
            data: requestaQuote,
            message: "Request a quote created successfully",
        });
    }catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong",
        });
    }
};

const getAllRequestaQuote = async (req, res) => {
    try{
        const requestaQuote = await RequestaQuote.find();
        if (!requestaQuote) {
            return res.status(404).json({
                message: "No request a quote found",
            });
        }
        res.status(200).json({
            data: requestaQuote,
            message: "Request a quote retrieved successfully",
        });
    }catch (error) {
        res.status(500).json({
            message: error.message || "Something went wrong",
        });
    }
}

const getaUserQuote = async (req, res) =>{
    try{
        const requestaQuote = await RequestaQuote.findById(req.params.id);
        if (!requestaQuote) {
            return res.status(404).json({
                message: "No request a quote found",
            });
        }
        res.status(200).json({
            data: requestaQuote,
            message: "Request a quote retrieved successfully",
        });
    }catch(error){
        res.stauus(500).json({
            message: error.message || "Something went wrong",
        });
    }
}

module.exports = {
    createRequestaQuote, getAllRequestaQuote, getaUserQuote
};