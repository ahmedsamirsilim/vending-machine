import { User } from "../db";
import type { CreateUserInput, UpdateUserInput, UserSchema } from "../dtos";

export const createUser = async (input: CreateUserInput) => {
	return await User.create(input);
};

export const findUser = async (query: UserSchema) => {
	return await User.findOne(query).select("-password");
};

export const findUsers = async () => {
	return await User.find().select("-password");
};

export const updateUser = async (id: string, input: UpdateUserInput) => {
	return await User.findByIdAndUpdate(id, input, { new: true }).select(
		"-password",
	);
};

export const deleteUser = async (id: string) => {
	return await User.findByIdAndDelete(id);
};
