const User = require('../models/user');

exports.saveUserForm = async (req, res) => {
    const formData = req.body;
    console.log('Form data:', formData);
    if (Object.keys(formData).length == 0 || typeof formData !== 'object') {
        console.error('Invalid form data');
        res.status(500).send();
        return;
    }
    // console.log('Form data:', formData);
    // console.log('Type of form data:', typeof formData);
    try {
        await User.saveUserForm(formData);
        res.status(200).send();
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).send();
    }
}


exports.deleteUser = async (req, res) => {
    const email = req.body.email;
    try {
        await User.deleteUser(email);
        res.status(200).send();
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send();
    }
}   