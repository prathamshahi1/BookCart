import User from '../models/User.js';
import Book from '../models/Book.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';

// @desc    Get admin dashboard KPI statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalBooks = await Book.countDocuments({});
    const totalOrders = await Order.countDocuments({});

    // Calculate total revenue from paid or non-cancelled orders
    const revenueResult = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const pendingOrders = await Order.countDocuments({ orderStatus: 'Pending' });
    const deliveredOrders = await Order.countDocuments({ orderStatus: 'Delivered' });
    const lowStockBooksCount = await Book.countDocuments({ stock: { $lte: 5 } });

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent users
    const recentUsers = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    // Low stock books
    const lowStockBooks = await Book.find({ stock: { $lte: 5 } })
      .select('title author stock price image category')
      .limit(6);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        pendingOrders,
        deliveredOrders,
        lowStockCount: lowStockBooksCount,
        recentOrders,
        recentUsers,
        lowStockBooks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comprehensive store analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res, next) => {
  try {
    // 1. Monthly Revenue & Orders (Last 6 months)
    const monthlyStats = await Order.aggregate([
      {
        $match: { orderStatus: { $ne: 'Cancelled' } }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthlyData = monthlyStats.map((item) => ({
      month: `${monthNames[item._id.month - 1]} ${item._id.year}`,
      revenue: Math.round(item.revenue),
      orders: item.orders
    }));

    // Fallback sample graph data if new database
    const salesChartData = formattedMonthlyData.length > 0 ? formattedMonthlyData : [
      { month: 'Mar', revenue: 14200, orders: 28 },
      { month: 'Apr', revenue: 21500, orders: 42 },
      { month: 'May', revenue: 18900, orders: 37 },
      { month: 'Jun', revenue: 32400, orders: 64 },
      { month: 'Jul', revenue: 28600, orders: 55 },
      { month: 'Aug', revenue: 41200, orders: 83 }
    ];

    // 2. Order status distribution
    const statusCounts = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Category distribution of books
    const categoryDistribution = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Top Selling Books
    const topBooks = await Book.find({}).sort({ numReviews: -1, rating: -1 }).limit(5);

    res.json({
      success: true,
      data: {
        salesChartData,
        orderStatusDistribution: statusCounts.map((s) => ({ status: s._id, count: s.count })),
        categoryDistribution: categoryDistribution.map((c) => ({ name: c._id, count: c.count })),
        topSellingBooks: topBooks
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users with search & filters
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const query = {};

    if (req.query.search && req.query.search.trim() !== '') {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }];
    }

    if (req.query.role && req.query.role !== 'all') {
      query.role = req.query.role;
    }

    const count = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      success: true,
      data: {
        users,
        page,
        pages: Math.ceil(count / pageSize),
        totalUsers: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user status (Block/Unblock or change role)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent admin from blocking themselves
    if (user._id.toString() === req.user._id.toString() && req.body.isBlocked === true) {
      return res.status(400).json({
        success: false,
        message: 'You cannot block your own administrative account'
      });
    }

    if (req.body.isBlocked !== undefined) {
      user.isBlocked = Boolean(req.body.isBlocked);
    }

    if (req.body.role && ['user', 'admin'].includes(req.body.role)) {
      user.role = req.body.role;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        isBlocked: updatedUser.isBlocked
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own administrative account'
      });
    }

    await User.deleteOne({ _id: user._id });

    res.json({
      success: true,
      message: 'User account removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
