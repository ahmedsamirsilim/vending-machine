import type { CreateUserInput, UpdateUserInput } from "../dtos";
import { UserService } from "../services";

export const createUser = async (input: CreateUserInput) => {
	return await UserService.createUser(input);
};

export const getUserById = async (id: string) => {
	return await UserService.findUserById(id);
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
