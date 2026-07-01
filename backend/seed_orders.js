const db = require('./db');

async function seedOrders() {
  try {
    // Add columns if not exist
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);
    await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT`);
    console.log('Columns updated.');

    // Get admin user and some products
    const { rows: users } = await db.query(`SELECT id, name FROM users LIMIT 3`);
    const { rows: products } = await db.query(`SELECT id, name, price FROM products LIMIT 6`);

    if (users.length === 0 || products.length === 0) {
      console.log('No users or products found. Skipping seed.');
      process.exit(0);
    }

    // Clear existing orders
    await db.query('DELETE FROM order_items');
    await db.query('DELETE FROM orders');

    const statuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
    const orders = [];

    for (let i = 0; i < 8; i++) {
      const user = users[i % users.length];
      const status = statuses[i % statuses.length];
      const numItems = 1 + (i % 3);
      let total = 0;
      const items = [];

      for (let j = 0; j < numItems; j++) {
        const prod = products[(i + j) % products.length];
        const qty = 1 + (j % 3);
        const price = parseFloat(prod.price);
        total += price * qty;
        items.push({ product_id: prod.id, quantity: qty, price });
      }

      const daysAgo = i * 3;
      const { rows } = await db.query(
        `INSERT INTO orders (user_id, total, status, notes, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW() - INTERVAL '${daysAgo} days', NOW() - INTERVAL '${Math.max(0, daysAgo - 1)} days')
         RETURNING id`,
        [user.id, total.toFixed(2), status, i % 2 === 0 ? 'Enviar con cuidado, botellas frágiles' : null]
      );

      const orderId = rows[0].id;
      for (const item of items) {
        await db.query(
          `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
          [orderId, item.product_id, item.quantity, item.price]
        );
      }

      orders.push({ id: orderId, status, total: total.toFixed(2) });
    }

    console.log(`SUCCESS: ${orders.length} sample orders created.`);
    orders.forEach(o => console.log(`  Order ${o.id.slice(0,8)}... | $${o.total} | ${o.status}`));
    process.exit(0);
  } catch (error) {
    console.error('Error seeding orders:', error);
    process.exit(1);
  }
}

seedOrders();
