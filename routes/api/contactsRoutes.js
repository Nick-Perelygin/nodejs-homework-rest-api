const express = require('express')
const router = express.Router()
const ctrl = require('../../controllers/contactsControllers')
const {validateBody, isValidId, authenticate} = require('../../middleware')
const {contactsSchema} = require('../../schemas')
const {schemas} = contactsSchema

router.get('/', authenticate, ctrl.listContacts)

router.get('/:contactId', authenticate, isValidId, ctrl.getContactById)

router.post('/', authenticate, validateBody(schemas.addSchema), ctrl.addContact)

router.delete('/:contactId', authenticate, isValidId, ctrl.removeContact)

router.put('/:contactId', authenticate, isValidId, validateBody(schemas.addSchema), ctrl.updateContact)

router.patch('/:contactId/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), ctrl.updateStatusContact)

module.exports = router