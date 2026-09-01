const { pool: db } = require("../config/db");

const parseNumber = (value, fallback = 0) => {
  const num = Number(value ?? fallback);
  return Number.isFinite(num) ? num : fallback;
};

const getDateKey = (date) => new Date(date).toISOString().slice(0, 10);

const getDashboardOverview = async (req, res) => {
  try {
    const [
      totalOrdersResult,
      totalUsersResult,
      totalProductsResult,
      totalRevenueResult,
      salesResult,
      recentOrdersResult,
      recentContactsResult,
      topProductsResult,
      inventoryResult,
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) AS total FROM pa_orders`),
      db.query(`SELECT COUNT(*) AS total FROM pa_users WHERE status = 'active'`),
      db.query(`SELECT COUNT(*) AS total FROM pa_products`),
      db.query(`SELECT COALESCE(SUM(CAST(total_amount AS DECIMAL(10,2))), 0) AS total FROM pa_orders`),
      db.query(`
        SELECT DATE(created_at) AS date,
               COALESCE(SUM(CAST(total_amount AS DECIMAL(10,2))), 0) AS revenue
        FROM pa_orders
        WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 6 DAY)
        GROUP BY DATE(created_at)
        ORDER BY DATE(created_at) ASC
      `),
      db.query(`
        SELECT o.id,
               o.total_amount,
               o.status,
               o.created_at,
               u.name AS customer_name
        FROM pa_orders o
        LEFT JOIN pa_users u ON u.user_id = o.user_id
        ORDER BY o.created_at DESC
        LIMIT 5
      `),
      db.query(`
        SELECT id, name, email, subject, status, created_at
        FROM pa_contacts
        ORDER BY created_at DESC
        LIMIT 5
      `),
      db.query(`
        SELECT p.prod_name,
               COALESCE(SUM(oi.quantity), 0) AS total_sold
        FROM pa_products p
        LEFT JOIN pa_order_items oi ON oi.product_id = p.id
        GROUP BY p.id, p.prod_name
        ORDER BY total_sold DESC, p.prod_name ASC
        LIMIT 5
      `),
      db.query(`
        SELECT
          (SELECT COUNT(*) FROM pa_categories) AS categories,
          (SELECT COUNT(*) FROM pa_weights WHERE status = 1) AS active_weights,
          (SELECT COUNT(*) FROM pa_products WHERE CAST(current_stock AS SIGNED) <= 0) AS out_of_stock,
          (SELECT COUNT(*) FROM pa_products WHERE CAST(current_stock AS SIGNED) > 0 AND CAST(current_stock AS SIGNED) <= 10) AS low_stock
      `),
    ]);

    const totalOrders = parseNumber(totalOrdersResult[0][0]?.total, 0);
    const totalUsers = parseNumber(totalUsersResult[0][0]?.total, 0);
    const totalProducts = parseNumber(totalProductsResult[0][0]?.total, 0);
    const totalRevenue = parseNumber(totalRevenueResult[0][0]?.total, 0);

    const salesMap = new Map();
    for (const row of salesResult[0] || []) {
      salesMap.set(getDateKey(row.date), parseNumber(row.revenue, 0));
    }

    const salesOverview = [];
    const endDate = new Date();

    for (let i = 6; i >= 0; i -= 1) {
      const currentDate = new Date(endDate);
      currentDate.setDate(endDate.getDate() - i);

      const key = getDateKey(currentDate);
      const label = currentDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      salesOverview.push({
        label,
        date: key,
        value: salesMap.get(key) || 0,
      });
    }

    const recentOrders = (recentOrdersResult[0] || []).map((order) => ({
      id: order.id,
      orderId: `#ORD${String(order.id).padStart(4, "0")}`,
      customer: order.customer_name || "Guest User",
      amount: parseNumber(order.total_amount, 0),
      status: order.status || "received",
      created_at: order.created_at,
    }));

    const recentContacts = (recentContactsResult[0] || []).map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject || "General enquiry",
      status: contact.status || "unread",
      created_at: contact.created_at,
    }));

    const topProducts = (topProductsResult[0] || []).map((product) => ({
      name: product.prod_name,
      sold: parseNumber(product.total_sold, 0),
    }));

    const inventory = inventoryResult[0][0] || {};

    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully",
      data: {
        summary: {
          totalOrders,
          totalUsers,
          totalProducts,
          totalRevenue,
        },
        salesOverview,
        recentOrders,
        recentContacts,
        topProducts,
        inventory: {
          categories: parseNumber(inventory.categories, 0),
          activeWeights: parseNumber(inventory.active_weights, 0),
          outOfStock: parseNumber(inventory.out_of_stock, 0),
          lowStock: parseNumber(inventory.low_stock, 0),
        },
      },
    });
  } catch (error) {
    console.error("Dashboard overview error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard overview",
    });
  }
};

module.exports = {
  getDashboardOverview,
};
