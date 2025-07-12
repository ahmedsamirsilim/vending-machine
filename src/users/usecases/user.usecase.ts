import type { CreateUserInput, UpdateUserInput, UserSchema } from "../dtos";
import { UserServices } from "../services";

const CreateUser = async (input: CreateUserInput) => {
	return await UserServices.createUser(input);
};

const GetUser = async (query: UserSchema) => {
	return await UserServices.findUser(query);
};

const GetAllUsers = async () => {
	return await UserServices.findUsers();
};

const UpdateUser = async (UserSchema: UserSchema, input: UpdateUserInput) => {
	return await UserServices.updateUser(UserSchema, input);
};

const DeleteUser = async (UserSchema: UserSchema) => {
	return await UserServices.deleteUser(UserSchema);
};

export const UserUseCase = {
	CreateUser,
	GetUser,
	GetAllUsers,
	UpdateUser,
	DeleteUser,
};
