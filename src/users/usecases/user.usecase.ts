import type { CreateUserInput, UpdateUserInput, UserSchema } from "../dtos";
import { UserService } from "../services";

export const createUser = async (input: CreateUserInput) => {
	return await UserService.createUser(input);
};

export const getUser = async (query: UserSchema) => {
	return await UserService.findUser(query);
};

export const getAllUsers = async () => {
	return await UserService.findUsers();
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
	return await UserService.updateUser(id, input);
};

export const deleteUser = async (id: string) => {
	return await UserService.deleteUser(id);
};
