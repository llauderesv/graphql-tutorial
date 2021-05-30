const Query = {
  // Get total number of photos...
  totalPhotos: (_, args, { db }) =>
    db.collection('photos').estimatedDocumentCount(),
  // Get all uploaded photos...
  allPhotos: (_, args, { db }) => db.collection('photos').find().toArray(),
  // Get total number of users...
  totalUsers: (_, args, { db }) =>
    db.collection('users').estimatedDocumentCount(),
  // Get all uploaded users...
  allUsers: async (_, args, { db }) => {
    const users = await db.collection('users').find().toArray();
    return users;
  },
};

export default Query;
