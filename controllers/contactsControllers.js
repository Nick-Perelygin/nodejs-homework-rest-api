const {contactsSchema} = require('../schemas');
const {HttpError, ctrlWrapper} = require('../utility');
const contact = contactsSchema.Contact

async function listContacts (req, res) {
    const {_id: owner} = req.user;
    const result = await contact.find({owner}, '-createdAt -updatedAt');
    res.json(result);
}

async function getContactById(req, res) {
    const {contactId} = req.params;
    const result = await contact.findById(contactId);
    if(!result){
        throw HttpError(404);
    }
    res.json(result);
}

async function removeContact(req, res) {
    const {contactId} = req.params;
    const result = await contact.findByIdAndRemove(contactId);
    if(!result){
        throw HttpError(404);
    }
    res.json({message: 'contact deleted'});
}
  
async function addContact(req, res) {
    const {_id: owner} = req.user;
    const result = await contact.create({...req.body, owner});
    res.status(201).json(result);
}

async function updateContact(req, res) {
    const {contactId} = req.params;
    const result = await contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if(!result){
        throw HttpError(404);
    }
    res.json(result);
}

async function updateStatusContact(req, res) {
    if(!req.body){
        throw HttpError(400, 'Missing field favorite');
    }
    const {contactId} = req.params;
    const result = await contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if(!result){
        throw HttpError(404);
    }
    res.json(result);
}

module.exports = {
    listContacts: ctrlWrapper(listContacts),
    getContactById: ctrlWrapper(getContactById),
    removeContact: ctrlWrapper(removeContact),
    addContact: ctrlWrapper(addContact),
    updateContact: ctrlWrapper(updateContact),
    updateStatusContact: ctrlWrapper(updateStatusContact)
}