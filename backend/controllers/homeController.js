import { UserMain as User } from './dbController.js';

/**
 * Controller: Get Home page dashboard information and overview
 */
export const getHomeData = async (req, res) => {
  try {
    // Basic stats from eco_development
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ working_status: { $ne: 'resigned' } });

    return res.status(200).json({
      success: true,
      message: 'Home data retrieved successfully',
      data: {
        systemName: 'eco_development Portal',
        serverStatus: 'Operational',
        uptime: `${process.uptime().toFixed(0)} seconds`,
        timestamp: new Date().toISOString(),
        stats: {
          totalEmployees: totalUsers,
          activeEmployees: activeUsers || totalUsers,
          database: 'Connected (eco_development)',
        },
        quickModules: [
          {
            id: 'mod-1',
            title: 'Employee Directory',
            desc: 'View employee records, departments, and roles.',
            category: 'Human Resources',
          },
          {
            id: 'mod-2',
            title: 'Operations & IoT',
            desc: 'Monitor line devices, clamps, and detector sensors.',
            category: 'Operations',
          },
          {
            id: 'mod-3',
            title: 'QMS & Audits',
            desc: 'Quality management, checklists, and 8S reports.',
            category: 'Quality',
          },
          {
            id: 'mod-4',
            title: 'System & Security',
            desc: 'Manage API tokens, SSL certificates, and permissions.',
            category: 'Administration',
          },
        ],
      },
    });
  } catch (error) {
    console.error('[Home Controller Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve home dashboard data',
      error: error.message,
    });
  }
};

export default {
  getHomeData,
};

