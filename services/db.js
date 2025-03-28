const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Database service for handling database operations
 */
const dbService = {
  // Generic CRUD operations
  findById: async (model, id) => {
    return await prisma[model].findUnique({
      where: { [model === 'User' ? 'id' : `${model.toLowerCase()}Id`]: id }
    });
  },

  findMany: async (model, filter = {}, include = {}) => {
    return await prisma[model].findMany({
      where: filter,
      include
    });
  },

  create: async (model, data) => {
    return await prisma[model].create({
      data
    });
  },

  update: async (model, id, data) => {
    const idField = model === 'User' ? 'id' : `${model.toLowerCase()}Id`;
    return await prisma[model].update({
      where: { [idField]: id },
      data
    });
  },

  delete: async (model, id) => {
    const idField = model === 'User' ? 'id' : `${model.toLowerCase()}Id`;
    return await prisma[model].delete({
      where: { [idField]: id }
    });
  },

  // Practice-specific operations
  findPracticeWithDetails: async (practiceId) => {
    return await prisma.Practices.findUnique({
      where: { practiceId },
      include: {
        rep: true,
        facilities: {
          include: {
            facility: true
          }
        },
        physicians: {
          include: {
            facilities: {
              include: {
                facility: true
              }
            }
          }
        }
      }
    });
  },

  // Order-specific operations
  findOrderWithDetails: async (orderId) => {
    return await prisma.Orders.findUnique({
      where: { id: orderId },
      include: {
        createdBy: true,
        rep: true,
        practice: true,
        facility: true,
        physician: true,
        orderItems: {
          include: {
            product: {
              include: {
                manufacturer: true
              }
            },
            productPricing: true
          }
        }
      }
    });
  },

  // User/Rep specific operations
  findUserWithSubReps: async (userId) => {
    return await prisma.Users.findUnique({
      where: { userId },
      include: {
        subReps: true
      }
    });
  },

  // Commission specific operations
  findCommissionWithDetails: async (commissionId) => {
    return await prisma.Commissions.findUnique({
      where: { id: commissionId },
      include: {
        rep: true,
        order: {
          include: {
            orderItems: {
              include: {
                product: true,
                productPricing: true
              }
            }
          }
        },
        adjustments: {
          include: {
            Users: true
          }
        }
      }
    });
  },

  // Facility specific operations
  findFacilityWithDetails: async (facilityId) => {
    return await prisma.Facilities.findUnique({
      where: { facilityId },
      include: {
        users: true,
        physicianFacilities: {
          include: {
            physician: true
          }
        },
        practiceFacilities: {
          include: {
            practice: true
          }
        }
      }
    });
  },

  // Document specific operations
  findDocumentWithSignatures: async (documentId) => {
    return await prisma.Documents.findUnique({
      where: { documentId },
      include: {
        signatures: true,
        createdBy: true
      }
    });
  }
};

module.exports = dbService;
