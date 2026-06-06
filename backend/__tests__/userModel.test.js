jest.mock('../models/db', () => ({ query: jest.fn() }));
const db = require('../models/db');
const User = require('../models/userModel.sql.js');

describe('User model', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('getAllUsers should return all users', async () => {
    const rows = [{ id: 1, login: 'foo' }];
    db.query.mockResolvedValueOnce({ rows });

    const result = await User.getAllUsers();

    expect(db.query).toHaveBeenCalledWith('SELECT id, email AS login, password, full_name FROM users');
    expect(result).toEqual(rows);
  });

  it('addToDatabase should insert new user and return created row', async () => {
    const input = { full_name: 'Anna', login: 'anna@example.com', password: 'secret' };
    const returned = { id: 7, ...input };
    db.query.mockResolvedValueOnce({ rows: [returned] });

    const result = await User.addToDatabase(input);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO users'),
      [input.full_name, input.login, input.password]
    );
    expect(result).toEqual(returned);
  });

  it('findUserByLogin should return a user row when found', async () => {
    const row = { id: 9, login: 'test@example.com' };
    db.query.mockResolvedValueOnce({ rows: [row] });

    const result = await User.findUserByLogin('test@example.com');

    expect(db.query).toHaveBeenCalledWith('SELECT id, email AS login, password, full_name, role FROM users WHERE email = $1', ['test@example.com']);
    expect(result).toEqual(row);
  });
});
