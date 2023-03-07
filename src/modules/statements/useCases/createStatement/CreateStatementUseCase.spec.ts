import { InMemoryUsersRepository } from "@modules/users/repositories/in-memory/InMemoryUsersRepository";
import { AppError } from "@shared/errors/AppError";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { ICreateStatementDTO } from "./ICreateStatementDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";

let createStatementUseCase: CreateStatementUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance Profile", () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("Should be able to create a deposit statement ", async () => {
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

    const balanceCreated = await createStatementUseCase.execute(balance);

    expect(balanceCreated.amount).toBe(100.5);
  });

  it("Should not be able to create a deposit statement from a nonexistent user", async () => {
    expect(async () => {
      const balance: ICreateStatementDTO = {
        amount: 100.5,
        description: "balance",
        user_id: "nonexistent id",
        type: OperationType.DEPOSIT,
      };

      await createStatementUseCase.execute(balance);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should be able to create a withdraw statement when there is founds for it", async () => {
    const user = {
      name: "user test",
      email: "user@test.com",
      password: "password",
    };

    const userCreated = await inMemoryUsersRepository.create(user);

    const deposit: ICreateStatementDTO = {
      amount: 100.5,
      description: "deposit",
      user_id: userCreated.id,
      type: OperationType.DEPOSIT,
    };

    const withdraw: ICreateStatementDTO = {
      amount: -100.5,
      description: "deposit",
      user_id: userCreated.id,
      type: OperationType.DEPOSIT,
    };

    await createStatementUseCase.execute(deposit);
    const withdrawCreated = await createStatementUseCase.execute(withdraw);

    expect(withdrawCreated.amount).toBe(-100.5);
  });

  it("Should not be able to create a withdraw statement from a nonexistent user", async () => {
    expect(async () => {
      const user = {
        name: "user test",
        email: "user@test.com",
        password: "password",
      };

      const userCreated = await inMemoryUsersRepository.create(user);

      const deposit: ICreateStatementDTO = {
        amount: 100.5,
        description: "deposit",
        user_id: userCreated.id,
        type: OperationType.DEPOSIT,
      };

      const balance: ICreateStatementDTO = {
        amount: 100.5,
        description: "balance",
        user_id: "nonexistent id",
        type: OperationType.DEPOSIT,
      };

      await createStatementUseCase.execute(deposit);
      await createStatementUseCase.execute(balance);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to create a withdraw statement from when there is Insufficient founds", async () => {
    expect(async () => {
      const user = {
        name: "user test",
        email: "user@test.com",
        password: "password",
      };

      const userCreated = await inMemoryUsersRepository.create(user);

      const withdraw: ICreateStatementDTO = {
        amount: 50000,
        description: "withdraw",
        user_id: userCreated.id,
        type: OperationType.WITHDRAW,
      };

      await createStatementUseCase.execute(withdraw);
    }).rejects.toBeInstanceOf(AppError);
  });
});
