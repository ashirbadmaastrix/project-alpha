const contactModel = require("../models/contactUsModel");


// Create Contact
const createContact = async (req, res) => {
    try {

        const {
            name,
            email,
            phone,
            subject,
            message
        } = req.body;


        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Name, email and message are required"
            });
        }


        const result = await contactModel.createContact({
            name,
            email,
            phone,
            subject,
            message
        });


        return res.status(201).json({
            success: true,
            message: "Your message has been submitted successfully",
            data: {
                id: result.insertId
            }
        });

    } catch (error) {

        console.error("Create Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit contact message"
        });
    }
};



// Get All Contacts
const getAllContacts = async (req, res) => {
    try {

        const contacts = await contactModel.getAllContacts();

        return res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });

    } catch (error) {

        console.error("Get Contacts Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch contact messages"
        });
    }
};



// Get Contact By ID
const getContactById = async (req, res) => {
    try {

        const { id } = req.params;

        const contact = await contactModel.getContactById(id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }


        return res.status(200).json({
            success: true,
            data: contact
        });

    } catch (error) {

        console.error("Get Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch contact message"
        });
    }
};



// Update Contact
const updateContact = async (req, res) => {
    try {

        const { id } = req.params;

        const existingContact = await contactModel.getContactById(id);

        if (!existingContact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }


        const data = req.body;

        const updatedData = {
            name: data.name ?? existingContact.name,
            email: data.email ?? existingContact.email,
            phone: data.phone ?? existingContact.phone,
            subject: data.subject ?? existingContact.subject,
            message: data.message ?? existingContact.message,
            status: data.status ?? existingContact.status
        };


        await contactModel.updateContact(id, updatedData);


        return res.status(200).json({
            success: true,
            message: "Contact message updated successfully"
        });

    } catch (error) {

        console.error("Update Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update contact message"
        });
    }
};



// Delete Contact
const deleteContact = async (req, res) => {
    try {

        const { id } = req.params;

        const existingContact = await contactModel.getContactById(id);

        if (!existingContact) {
            return res.status(404).json({
                success: false,
                message: "Contact message not found"
            });
        }


        await contactModel.deleteContact(id);


        return res.status(200).json({
            success: true,
            message: "Contact message deleted successfully"
        });

    } catch (error) {

        console.error("Delete Contact Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete contact message"
        });
    }
};



module.exports = {
    createContact,
    getAllContacts,
    getContactById,
    updateContact,
    deleteContact
};