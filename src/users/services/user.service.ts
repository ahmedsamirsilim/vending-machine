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

const updateUser = async (UserSchema: UserSchema, input: UpdateUserInput) => {
	return await User.findByIdAndUpdate(UserSchema, input, {
		new: true,
	}).select("-password");
};

const deleteUser = async (UserSchema: UserSchema) => {
	return await User.findByIdAndDelete(UserSchema._id);
};

export const UserServices = {
	createUser,
	findUser,
	findUsers,
	updateUser,
	deleteUser,
};
