import { AppError } from "@shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Show User Profile", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show a user", async () => {
    const user = {
      name: "user test",
      email: "user@test.com",
      password: "password",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    const userProfile = await showUserProfileUseCase.execute(userCreated.id);

    expect(userProfile).toHaveProperty("id");
    expect(userProfile.name).toBe("user test");
    expect(userProfile.email).toBe("user@test.com");
  });

  it("Should not be able to show a nonexistent user", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("nonexistent id");
    }).rejects.toBeInstanceOf(AppError);
  });
});
