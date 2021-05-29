const Contacts = require('../model/index')

// список всех контактов
const getList = async (req, res, next) => {
  try {
    // console.log(req.user.id)
    const userId = req.user.id
    const { contacts, total, limit, offset } = await Contacts.listContacts(userId, req.query)
    return res.json({ status: 'success', code: 200, data: { total, limit, offset, contacts } })
  } catch (err) {
    next(err)
  }
}

// поиск контакта по id
const getOne = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.getContactById(userId, req.params.contactId)
    if (contact) {
      return res.json({ status: 'success', code: 200, data: { contact } })
    }
    return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
}

// создать контакт
const create = async (req, res, next) => {
  try {
    const userId = req.user.id
    // const { name, email, phone } = req.body
    const contact = await Contacts.addContact({ ...req.body, owner: userId })

    return res.status(201).json({ status: 'success', code: 201, data: { contact } })
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.code = 400
      error.status = 'error'
    }
    next(error)
  }
}

// удалить контакт
const remove = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.removeContact(userId, req.params.contactId)
    if (contact) {
      return res.json({ status: 'success', code: 200, data: { contact }, message: `Contact ${req.params.contactId} succesfully deleted` })
    } return res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
}

// редактировать контакт
const update = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.updateContact(userId, req.params.contactId, req.body)
    if (contact._id) {
      return res.json({ status: 'success', code: 200, data: { contact } })
    }
    res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
}

// добавить/удалить в избранное
const updateStatus = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.updateStatusContact(userId, req.params.contactId, req.body)
    if (contact._id) {
      return res.json({ status: 'success', code: 200, data: { contact } })
    }
    res.status(404).json({ status: 'error', code: 404, message: 'Not found' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getList,
  getOne,
  create,
  remove,
  update,
  updateStatus

}
