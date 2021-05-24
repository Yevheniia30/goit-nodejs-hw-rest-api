const express = require('express')
const router = express.Router()
const Contacts = require('../../model/index')
const { validateAddContact, validateUpdateContact, validateUpdateStatus } = require('./validation')

// список всех контактов
router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()
    return res.json({ status: 'success', code: 200, data: { contacts } })
  } catch (err) {
    next(err)
  }
})

// поиск контакта по id
router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId)
    if (contact) {
      return res.json({ status: 'success', code: 200, data: { contact } })
    }
    return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
})

// создать контакт
router.post('/', validateAddContact, async (req, res, next) => {
  try {
    const { name, email, phone } = req.body
    const contact = await Contacts.addContact({ name, email, phone })

    return res.status(201).json({ status: 'success', code: 201, data: { contact } })
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.code = 400
      error.status = 'error'
    }
    next(error)
  }
})

// удалить контакт
router.delete('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)
    if (contact) {
      return res.json({ status: 'success', code: 200, data: { contact }, message: `Contact ${req.params.contactId} succesfully deleted` })
    } return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
})

// редактировать контакт
router.put('/:contactId', validateUpdateContact, async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    if (contact._id) {
      return res.json({ status: 'success', code: 200, data: { contact } })
    }
    res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
})

// добавить/удалить в избранное
router.patch('/:contactId/favorite', validateUpdateStatus, async (req, res, next) => {
  try {
    const contact = await Contacts.updateStatusContact(req.params.contactId, req.body)
    if (contact._id) {
      return res.json({ status: 'success', code: 200, data: { contact } })
    }
    res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
