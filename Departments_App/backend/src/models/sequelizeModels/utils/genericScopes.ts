export default {
    find: {
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    },
    id(id: number) {
        return { where: { id: id } };
    }
};
