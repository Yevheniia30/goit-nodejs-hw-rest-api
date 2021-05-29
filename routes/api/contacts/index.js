const express = require('express')
const router = express.Router()
const guard = require('../../../helpers/guard')
const {
  getList,
  getOne,
  create,
  remove,
  update,
  updateStatus
} = require('../../../controllers/contacts')
const {
  validateAddContact,
  validateUpdateContact,
  validateUpdateStatus
} = require('./validation')

// список всех контактов
router.get('/', guard, getList)

// поиск контакта по id
router.get('/:contactId', guard, getOne)

// создать контакт
router.post('/', guard, validateAddContact, create)

// удалить контакт
router.delete('/:contactId', guard, remove)

// редактировать контакт
router.put('/:contactId', guard, validateUpdateContact, update)

// добавить/удалить в избранное
router.patch('/:contactId/favorite', guard, validateUpdateStatus, updateStatus)

module.exports = router
