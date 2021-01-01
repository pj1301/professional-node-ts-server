interface UserDBObject {
  username: string;
  email: string;
  role: string;
  tokenId: string;
  _id: string;
  password: string;
}

interface User {
  username: string;
  email: string;
  role: string;
  _id: string;
}

interface RequestUser {
  username: string;
  email: string;
  role: string;
  tokenId: string;
  _id: string;
}

interface EditedUser {
  username: string;
  email: string;
  role: string;
  newPassword: string;
  oldPassword: string;
}

export { UserDBObject, User, RequestUser, EditedUser };
