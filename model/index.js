const Contact = require('./schemas/contact')

// список всех контактов
const listContacts = async (userId, query) => {
  const { limit = 20, offset = 0, sortBy, sortByDesc, filter, favorite = null } = query
  // console.log(Boolean(favorite))
  const optionsSearch = { owner: userId }
  if (favorite !== null) {
    optionsSearch.favorite = favorite
  }
  const result = await Contact.paginate(optionsSearch,
    {
      limit,
      offset,
      select: filter ? filter.split('|').join(' ') : '',
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: 1 } : {})
      }
    })

  // .populate({ path: 'owner', select: 'email subscription -_id' })
  const { docs: contacts, totalDocs: total } = result
  return { contacts, total, limit, offset }
}

// найти контакт по id
const getContactById = async (userId, contactId) => {
  const result = await Contact.find({ _id: contactId, owner: userId })
    .populate({ path: 'owner', select: 'email subscription -_id' })
  return result
}

// удалить контакт
const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndRemove({ _id: contactId, owner: userId })
  return result
}

// создать новый  контакт
const addContact = async (body) => {
  const result = await Contact.create(body)
  return result
}

// редактировать контакт
const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findByIdAndUpdate({
    _id: contactId,
    owner: userId
  },
  { ...body },
  { new: true })

  return result
}

// редактировать статус
const updateStatusContact = async (userId, contactId, body) => {
  const result = await Contact.findByIdAndUpdate({
    _id: contactId,
    owner: userId
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
