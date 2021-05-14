const path = require('path')
const fs = require('fs/promises')
const { v4: uuid } = require('uuid')

const contactsPath = path.join(__dirname, 'contacts.json')

// список всех контактов
const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath)
    return (JSON.parse(data))
  } catch (err) {
    console.log(err.message)
  }
}

// найти контакт по id
const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    const contact = contacts.find(({ id }) => String(id) === contactId)
    return contact
  } catch (err) {
    console.log(err.message)
  }
}

// удалить контакт
const removeContact = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    const deletedContact = contacts.filter(({ id }) => String(id) === contactId)
    const updatedContacts = JSON.stringify(contacts.filter(({ id }) => String(id) !== contactId), null, 2)
    await fs.writeFile(contactsPath, updatedContacts)
    return deletedContact
  } catch (err) {
    return undefined
  }
}

// создать новый  контакт
const addContact = async({ name, email, phone }) => {
  try {
    const body = { name, email, phone }
    if (!name || !email || !phone) {
      return
    }
    const data = await fs.readFile(contactsPath)
    const id = uuid()
    const contacts = JSON.parse(data)

    const newContact = {
      id,
      ...body
    }
    const newContactsList = JSON.stringify([...contacts, newContact], null, 2)
    await fs.writeFile(contactsPath, newContactsList)
    return newContact
  } catch (err) {
    console.log(err.message)
  }
}

// редактировать контакт
const updateContact = async (contactId, body) => {
  try {
    const data = await fs.readFile(contactsPath)
    const contacts = JSON.parse(data)
    const contact = contacts.find(({ id }) => String(id) === contactId)
    const updatedContact = { ...contact, ...body }

    const updatedContactsList = contacts.map((contact) => {
      if (updatedContact.id === contact.id) {
        return updatedContact
      } else {
        return contact
      }
    })

    await fs.writeFile(contactsPath, JSON.stringify(updatedContactsList, null, 2))

    return updatedContact
  } catch (err) {
    console.log(err.message)
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
