import { NotFoundError, UnauthorizedError } from "infra/errors.js";
import password from "models/password.js";
import user from "models/user.js";

async function getAuthenticatedUser(providedEmail, providedPassword) {
  try {
    const storedUser = await findUserByEmail(providedEmail);
    await validadePassword(providedPassword, storedUser.password);

    return storedUser;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw new UnauthorizedError({
        message: "Dados de autenticação não conferem.",
        action: "Verifique se os dados enviados estão corretos.",
      });
    }

    throw error;
  }

  async function findUserByEmail(providedEmail) {
    let storedUser;

    try {
      storedUser = await user.findOneByEmail(providedEmail);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new UnauthorizedError({
          message: "Email não confere.",
          action: "Verifique se este dado dado está correto.",
        });
      }

      throw error;
    }

    return storedUser;
  }

  async function validadePassword(providedPassword, storedPassword) {
    const correctPasswordMatch = await password.compare(
      providedPassword,
      storedPassword,
    );

    if (!correctPasswordMatch) {
      throw new UnauthorizedError({
        message: "Senha não confere.",
        action: "Verifique se este dado dado está correto.",
      });
    }
  }
}

const authentication = {
  getAuthenticatedUser,
};

export default authentication;
