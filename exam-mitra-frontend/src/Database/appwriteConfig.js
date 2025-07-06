export const account = {
  get: () => Promise.resolve({ name: "Guest" }),
  deleteSessions: () => Promise.resolve(),
  createEmailPasswordSession: () => Promise.resolve(),
  createOAuth2Session: () => Promise.resolve(),
  create: () => Promise.resolve(),
};

export const ID = {
  unique: () => "mock-id",
};

// 👇 Dummy mock for Appwrite's "databases" object
export const databases = {
  listDocuments: () => Promise.resolve({ documents: [] }),
  createDocument: () => Promise.resolve({}),
  updateDocument: () => Promise.resolve({}),
  deleteDocument: () => Promise.resolve({}),
};
