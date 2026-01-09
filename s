// GET /api/superadmin/subscriptions - List all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll({
      include: [{ model: User, attributes: ['name', 'email'] }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, subscriptions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch subscriptions' });
  }
};

// POST /api/superadmin/subscriptions/:id/extend - Extend subscription
const extendSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const { days } = req.body;
    
    const subscription = await Subscription.findByPk(id);
    if (!subscription) return res.status(404).json({ success: false, message: 'Subscription not found' });
    
    subscription.expiresAt = new Date(subscription.expiresAt.getTime() + days * 24 * 60 * 60 * 1000);
    await subscription.save();
    
    res.json({ success: true, message: 'Subscription extended' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to extend subscription' });
  }
};
