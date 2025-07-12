import { UserUseCase } from '../usecases';
import { User } from '../db/user.model';

jest.mock('../db/user.model');

describe('UserUseCase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CreateUser', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'testuser',
        password: 'password123',
        deposit: 0,
        role: 'buyer' as const,
      };

      (User.prototype.save as jest.Mock).mockResolvedValue(userData);

      const user = await UserUseCase.CreateUser(userData);

      expect(user).toBeDefined();
      expect(user.username).toBe(userData.username);
    });
  });
});
