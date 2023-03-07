import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to get a statement operation", async () => {
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
      type: OperationType.DEPOSIT,
    };

    const balanceCreated = await inMemoryStatementsRepository.create(balance);

    const operation = await getStatementOperationUseCase.execute({
      user_id: userCreated.id,
      statement_id: balanceCreated.id,
    });

    expect(operation.amount).toBe(100.5);
  });

  it("Should not be able to get a statement operation from a nonexistent user", async () => {
    expect(async () => {
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
        type: OperationType.DEPOSIT,
      };

      const balanceCreated = await inMemoryStatementsRepository.create(balance);

      await getStatementOperationUseCase.execute({
        user_id: "nonexistent id",
        statement_id: balanceCreated.id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to get a statement operation from a nonexistent balance", async () => {
    expect(async () => {
      const user = {
        name: "user test",
        email: "user@test.com",
        password: "password",
      };

      const userCreated = await inMemoryUsersRepository.create(user);

      await getStatementOperationUseCase.execute({
        user_id: userCreated.id,
        statement_id: "nonexistent id",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
