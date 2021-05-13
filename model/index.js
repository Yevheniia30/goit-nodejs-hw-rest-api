const path = require('path')
const fs = require('fs/promises')
const { v4: uuid } = require('uuid')
// const contacts = require('./contacts.json')

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

//
const getContactById = async (contactId) => {}

// удалить контакт
const removeContact = async (contactId) => {}

// создать новый  контакт
const addContact = async({ name, email, phone, englishSpeaking }) => {
  try {
    const body = { name, email, phone, englishSpeaking }
    if (!name || !email || !phone) {
      return
    }
    const data = await fs.readFile(contactsPath)
    const id = uuid()
    const contacts = JSON.parse(data)

    const newContact = {
      id,
      ...body,
      ...(englishSpeaking ? {} : { englishSpeaking: false })
    }
    const newContactsList = JSON.stringify([...contacts, newContact], null, 2)
    await fs.writeFile(contactsPath, newContactsList)
    // if (!body.name || !body.email || !body.phone) {
    //   return contacts
    // }

    return newContact

    // const record = { id, ...body }
    // data.push(record)
    // return (JSON.parse(record))
  } catch (err) {
    console.log(err.message)
  }
}

// редактировать контакт
const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
