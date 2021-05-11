const Query = {
  // Get total number of photos...
  totalPhotos: (_, args, { db }) =>
    db.collection('photos').estimatedDocumentCount(),
  // Get all uploaded photos...
  allPhotos: (_, args, { db }) => db.collection('photos').find().array(),
  // Get total number of users...
  totalUsers: (_, args, { db }) =>
    db.collection('users').estimatedDocumentCount(),
  // Get all uploaded users...
  allUsers: (_, args, { db }) => db.collection('users').find().array(),
};

export default Query;
