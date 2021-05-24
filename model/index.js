const Contact = require('./schemas/contact')

// список всех контактов
const listContacts = async () => {
  const result = await Contact.find({})
  return result
}

// найти контакт по id
const getContactById = async (contactId) => {
  const result = await Contact.find({ _id: contactId })
  return result
}

// удалить контакт
const removeContact = async (contactId) => {
  const result = await Contact.findByIdAndRemove({ _id: contactId })
  return result
}

// создать новый  контакт
const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

// редактировать контакт
const updateContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate({
    _id: contactId,
  },
  { ...body },
  { new: true })

  return result
}

// редактировать статус
const updateStatusContact = async (contactId, body) => {
  const result = await Contact.findByIdAndUpdate({
    _id: contactId,
  },
  { ...body },
  { new: true })

  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact
}
