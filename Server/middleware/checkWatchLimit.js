// middleware/checkWatchLimit.js
const planLimits = {
    Free: 5,
    Bronze: 7,
    Silver: 10,
    Gold: Infinity
};

export const checkWatchLimit = async (req, res, next) => {
    try {
        const user = req.user; // From auth middleware
        const { watchedMinutes } = req.body;

        const limit = planLimits[user.plan] ?? 5;

        if (watchedMinutes > limit) {
            return res.status(403).json({
                message: `Your plan (${user.plan}) allows only ${limit} minutes per video. Upgrade your plan to watch longer.`
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
