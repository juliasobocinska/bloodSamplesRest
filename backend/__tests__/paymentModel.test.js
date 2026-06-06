jest.mock('../models/db', () => ({ query: jest.fn() }));
const db = require('../models/db');
const Payment = require('../models/paymentModel.sql.js');

describe('Payment model', () => {
  beforeEach(() => {
    db.query.mockReset();
  });

  it('addToDatabase should insert payment and return inserted row', async () => {
    const mockRow = { id: 1, order_id: 2, payu_id: 'abc', price: 100, description: 'test', status: 'paid' };
    db.query.mockResolvedValueOnce({ rows: [mockRow] });

    const result = await Payment.addToDatabase(mockRow);

    expect(db.query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO payments'),
      [mockRow.order_id, mockRow.payu_id, mockRow.price, mockRow.description, mockRow.status]
    );
    expect(result).toEqual(mockRow);
  });

  it('findById should return payment row when found', async () => {
    const mockRow = { id: 7, order_id: 10 };
    db.query.mockResolvedValueOnce({ rows: [mockRow] });

    const result = await Payment.findById(7);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM payments WHERE id = $1', [7]);
    expect(result).toEqual(mockRow);
  });

  it('getByOrderId should return an array of rows', async () => {
    const rows = [{ id: 1 }, { id: 2 }];
    db.query.mockResolvedValueOnce({ rows });

    const result = await Payment.getByOrderId(5);

    expect(db.query).toHaveBeenCalledWith('SELECT * FROM payments WHERE order_id = $1 ORDER BY id DESC', [5]);
    expect(result).toEqual(rows);
  });
});
