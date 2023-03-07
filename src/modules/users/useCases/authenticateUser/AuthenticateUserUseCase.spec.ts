import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let authenticateUserUseCase: AuthenticateUserUseCase;
let userRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeAll(() => {
    userRepositoryInMemory = new InMemoryUsersRepository();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      userRepositoryInMemory
    );
    createUserUseCase = new CreateUserUseCase(userRepositoryInMemory);
  });

  it("Should be able to authenticate a user", async () => {
    const user = {
      name: "user test",
      email: "user@test.com",
      password: "password",
    };

    await createUserUseCase.execute(user);

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: "password",
    });

    expect(result).toHaveProperty("token");
  });

  it("Should not be able to authenticate user with the wrong email", async () => {
    expect(async () => {
      const user = {
        name: "user test 2",
        email: "user@test2.com",
        password: "password",
      };

      await createUserUseCase.execute({ ...user });

      await authenticateUserUseCase.execute({
        email: "wrong",
        password: user.password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate user with the wrong password", async () => {
    expect(async () => {
      const user = {
        name: "user test 3",
        email: "user@test3.com",
        password: "password",
      };

      const createUser = await createUserUseCase.execute(user);

      await authenticateUserUseCase.execute({
        email: createUser.email,
        password: "wrong",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate an nonexistent user", async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: "wrong",
        password: "wrong",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
