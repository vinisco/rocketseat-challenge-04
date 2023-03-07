import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = {
      name: "user test",
      email: "user@test.com",
      password: "password",
    };

    const createdUser = await createUserUseCase.execute(user);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser.name).toBe("user test");
    expect(createdUser.email).toBe("user@test.com");
  });

  it("Should not be able to create a new user with a already taken email", async () => {
    expect(async () => {
      const user = {
        name: "user test",
        email: "user@test.com",
        password: "password",
      };

      await createUserUseCase.execute(user);
      await createUserUseCase.execute(user);
    }).rejects.toBeInstanceOf(AppError);
  });
});
