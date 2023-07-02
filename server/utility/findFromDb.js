import models from '../models'
const { User } = models

const findUserByEmail = async (email) => {
  try {
    const user = await User.find({ email: email })
    return user[0]
  } catch {
    return null
  }
}

const findUserByStripeId = async (id) => {
  try {
    const user = await User.find({ stripeId: id })
    return user[0]
  } catch {
    return null
  }
}

const findUserById = async (id) => {
  try {
    const user = await User.findById(id)
    return user
  } catch {
    return null
  }
}

export { findUserByEmail, findUserByStripeId, findUserById }
