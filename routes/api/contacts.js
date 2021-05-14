const express = require('express')
const router = express.Router()
const Contacts = require('../../model/index')
// const { listContacts } = require('../../model/index')

// если после res не писать status(), он по умолчанию 200

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
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, englishSpeaking } = req.body
    const contact = await Contacts.addContact({ name, email, phone, englishSpeaking })
    if (!name || !email || !phone) {
      return res.status(400).json({ status: 'bad request', code: 400, message: 'missing required name field' })
    } return res.status(201).json({ status: 'success', code: 201, data: { contact } })
  } catch (err) {
    next(err)
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
router.put('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    // if (!req.body) {
    //   return res.status(400).json({ status: 'bad request', code: 400, message: 'missing fields' })
    // }
    if (contact.id) {
      return res.json({ status: 'success', code: 200, data: { contact } })
    }
    res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
