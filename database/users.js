const prisma = require('./prisma')

const saveUser = (user) => {
    return prisma.user.create({
        data: user
    })
}

const getAllUsers = () => {
    return prisma.user.findMany()
}

const getUserById = (id) => {
    return prisma.user.findFirst({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            email: true,
            password: false
        }
    })
}

const getUserByEmail = (email) => {
    return prisma.user.findFirst({
        where: {
            email
        }
    })
}

const updateUser = (id, user) => {
    return prisma.user.update({
        where: {
            id
        },
        data: user
    })
}

const deleteUser = (id) => {
    return prisma.user.delete({
        where: {
            id
        }
    })
}
module.exports = {
    saveUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    getUserByEmail
}