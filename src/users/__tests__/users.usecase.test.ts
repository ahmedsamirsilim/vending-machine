import { ObjectId } from 'mongodb';
import { UserServices } from '../services';
import { UserUseCase } from '../usecases';

jest.mock('../services');

describe('UserUseCase', () => {
  const mockUser = {
    _id: new ObjectId(),
    username: 'testuser',
    password: 'password123',
    deposit: 0,
    role: 'buyer' as const,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateUser', () => {
    it('should call UserServices.createUser and return a user', async () => {
      const userData = { username: 'testuser', password: 'password123', deposit: 0, role: 'buyer' as const };
      (UserServices.createUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserUseCase.CreateUser(userData);

      expect(UserServices.createUser).toHaveBeenCalledWith(userData);
      expect(result).toEqual(mockUser);
    });
  });

  describe('GetUser', () => {
    it('should call UserServices.findUser and return a user', async () => {
      const query = { _id: mockUser._id };
      (UserServices.findUser as jest.Mock).mockResolvedValue(mockUser);

      const result = await UserUseCase.GetUser(query);

      expect(UserServices.findUser).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockUser);
    });
  });

  describe('GetAllUsers', () => {
    it('should call UserServices.findUsers and return users', async () => {
      (UserServices.findUsers as jest.Mock).mockResolvedValue([mockUser]);

      const result = await UserUseCase.GetAllUsers();

      expect(UserServices.findUsers).toHaveBeenCalled();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('UpdateUser', () => {
    it('should call UserServices.updateUser', async () => {
      const query = { _id: mockUser._id };
      const updateData = { deposit: 100 };
      await UserUseCase.UpdateUser(query, updateData);
      expect(UserServices.updateUser).toHaveBeenCalledWith(query, updateData);
    });
  });

  describe('DeleteUser', () => {
    it('should call UserServices.deleteUser', async () => {
      const query = { _id: mockUser._id };
      await UserUseCase.DeleteUser(query);
      expect(UserServices.deleteUser).toHaveBeenCalledWith(query);
    });
  });
});
