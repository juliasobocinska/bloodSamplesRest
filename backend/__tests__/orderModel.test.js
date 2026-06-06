jest.mock('../models/db', () => ({ query: jest.fn() }));
const db = require('../models/db');
const Order = require('../models/orderModel.sql.js');

describe('Order model', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('getAllOrders should query all orders without userId', async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    db.query.mockResolvedValueOnce({ rows });

    const result = await Order.getAllOrders();

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM orders ORDER BY order_date DESC', []);
    expect(result).toEqual(rows);
  });

  it('getAllOrders should query user orders when userId is provided', async () => {
    const rows = [{ id: 1 }];
    db.query.mockResolvedValueOnce({ rows });

    const result = await Order.getAllOrders(42);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM orders WHERE user_id = $1 ORDER BY order_date DESC', [42]);
    expect(result).toEqual(rows);
  });

  it('addToDatabase should insert order and return created row', async () => {
    const order = { age: 30, quantity: 2, tests: 'blood', owner: 11, address: '123 Street' };
    const returned = { id: 3, ...order };
    db.query.mockResolvedValueOnce({ rows: [returned] });

    const result = await Order.addToDatabase(order);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO orders'),
      [order.age, order.quantity, order.tests, order.owner, order.address]
    );
    expect(result).toEqual(returned);
  });
});
