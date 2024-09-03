import { hashPassword } from "./helpers/bcrypt";
import { UserModel } from "./models/user";

import readlineSync from "readline-sync";

const replaceUser = async (email, firstName, lastName, newEmail, password) => {
  console.log(`Replacing user with email ${email}...`);
  const passwordHash = await hashPassword(password);
  await UserModel.findOneAndUpdate(
    { email },
    {
      firstName,
      lastName,
      email: newEmail,
      password: passwordHash,
    }
  );
  console.log(`User with email ${email} has been replaced with new user`);
};

const email = readlineSync.question("Enter email of user to replace: ");
const firstName = readlineSync.question("Enter first name of user: ");
const lastName = readlineSync.question("Enter last name of user: ");
const newEmail = readlineSync.question("Enter new email: ");
const password = readlineSync.question("Enter new password: ");

replaceUser(email, firstName, lastName, newEmail, password);
