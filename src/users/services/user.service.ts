import { User } from "../db";
import type { CreateUserInput, UpdateUserInput, UserSchema } from "../dtos";

const createUser = async (input: CreateUserInput) => {
	return await User.create(input);
};

const findUser = async (query: UserSchema) => {
	return await User.findOne(query);
};

const findUsers = async () => {
	return await User.find().select("-password");
};

const updateUser = async (id: string, input: UpdateUserInput) => {
	return await User.findByIdAndUpdate(id, input, { new: true }).select(
		"-password",
	);
};

const deleteUser = async (id: string) => {
	return await User.findByIdAndDelete(id);
};

export const UserServices = {
	createUser,
	findUser,
	findUsers,
	updateUser,
	deleteUser,
};
