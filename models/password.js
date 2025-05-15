import bcryptjs from "bcryptjs";
import { ValidationError } from "infra/errors";

async function hash(password) {
  if (password === undefined || password === null) {
    throw new ValidationError({
      message: "Ops, parece que se esqueceu da senha.",
    });
  }

  const rounds = getNumberOfRounds();
  const passwordWithPepper = addPepper(password);
  return await bcryptjs.hash(passwordWithPepper, rounds);
}

function getNumberOfRounds() {
  return process.env.NODE_ENV === "production" ? 14 : 1;
}

function addPepper(password) {
  const pepper = process.env.PEPPER || "CAROLINA_REAPER";
  return password + pepper;
}

async function compare(providedPassword, storedPassword) {
  const passwordWithPepper = addPepper(providedPassword);
  return await bcryptjs.compare(passwordWithPepper, storedPassword);
}

const password = {
  hash,
  compare,
};

export default password;
