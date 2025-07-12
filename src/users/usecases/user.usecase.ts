import type { CreateUserInput, UpdateUserInput, UserSchema } from "../dtos";
import { UserServices } from "../services";

const createUser = async (input: CreateUserInput) => {
	return await UserServices.createUser(input);
};

const getUser = async (query: UserSchema) => {
	return await UserServices.findUser(query);
};

const getAllUsers = async () => {
	return await UserServices.findUsers();
};

const updateUser = async (id: string, input: UpdateUserInput) => {
	return await UserServices.updateUser(id, input);
};

const deleteUser = async (id: string) => {
	return await UserServices.deleteUser(id);
};

export const UserUseCase = {
	createUser,
	getUser,
	getAllUsers,
	updateUser,
	deleteUser,
};
