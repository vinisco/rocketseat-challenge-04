import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let getBalanceUseCase: GetBalanceUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("Should be able to get balance", async () => {
    const user = {
      name: "user test",
      email: "user@test.com",
      password: "password",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    const balance: ICreateStatementDTO = {
      amount: 100.5,
      description: "balance",
      user_id: userCreated.id,
      type: OperationType.WITHDRAW,
    };

    await inMemoryStatementsRepository.create(balance);

    const balanceCreated = await getBalanceUseCase.execute({
      user_id: userCreated.id,
    });

    expect(balanceCreated.balance).toBe(-100.5);
    expect(balanceCreated.statement.length).toBe(1);
  });

  it("Should not be able to get balance from a nonexistent user", async () => {
    expect(async () => {
      const balanceCreated = await getBalanceUseCase.execute({
        user_id: "userCreated.id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
