const express = require('express')
const router = express.Router()
const Contacts = require('../../model/index')
// const { listContacts } = require('../../model/index')

// список всех контактов
router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()
    // если после res не писать status(), он по умолчанию 200
    return res.json({ status: 'success', code: 200, data: { contacts } })
  } catch (err) {
    next(err)
  }
})

//
router.get('/:contactId', async (req, res, next) => {
  res.json({ message: 'template2 message' })
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
  res.json({ message: 'template4 message' })
})

//
router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template5 message' })
})

module.exports = router
