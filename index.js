// Import required modules
const express = require('express');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { v4: uuidv4 } = require('uuid');
const compression = require('compression');
const helmet = require('helmet');
const session = require('express-session');
const fs = require('fs');
require('dotenv').config();

// Initialize Express and Prisma
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet({
  contentSecurityPolicy: false // For development
}));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}));
app.use(session({
  secret: process.env.SESSION_SECRET || 'msc-wound-care-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// API Routes
// =======================================

// Get manufacturers
app.get('/api/manufacturers', async (req, res) => {
  try {
    const manufacturers = await prisma.manufacturers.findMany({
      where: { status: 'active' },
      select: { manufacturerId: true, name: true }
    });
    res.json(manufacturers);
  } catch (error) {
    console.error('Error fetching manufacturers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch manufacturers' });
  }
});

// Get sales reps
app.get('/api/users', async (req, res) => {
  try {
    const role = req.query.role;
    const users = await prisma.users.findMany({
      where: { 
        status: 'active',
        ...(role ? { role } : {})
      },
      select: { userId: true, name: true, email: true, role: true }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch users' });
  }
});

// Get practices for a rep
app.get('/api/users/:userId/practices', async (req, res) => {
  try {
    const { userId } = req.params;
    const practices = await prisma.practices.findMany({
      where: { 
        repId: userId,
        status: 'active'
      },
      select: { practiceId: true, name: true }
    });
    res.json(practices);
  } catch (error) {
    console.error('Error fetching practices:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch practices' });
  }
});

// Get facilities for a practice
app.get('/api/practices/:practiceId/facilities', async (req, res) => {
  try {
    const { practiceId } = req.params;
    
    // Get facility IDs associated with the practice
    const facilityLinks = await prisma.practiceFacilities.findMany({
      where: { practiceId },
      select: { facilityId: true }
    });
    
    const facilityIds = facilityLinks.map(link => link.facilityId);
    
    // Get facility details
    const facilities = await prisma.facilities.findMany({
      where: { 
        facilityId: { in: facilityIds },
        status: 'active'
      },
      select: { 
        facilityId: true, 
        facilityName: true,
        address: true,
        city: true,
        state: true,
        zip: true
      }
    });
    
    res.json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch facilities' });
  }
});

// Get physicians for a practice
app.get('/api/practices/:practiceId/physicians', async (req, res) => {
  try {
    const { practiceId } = req.params;
    const physicians = await prisma.physicians.findMany({
      where: { 
        practiceId,
        status: 'active'
      },
      select: { physicianId: true, name: true }
    });
    res.json(physicians);
  } catch (error) {
    console.error('Error fetching physicians:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch physicians' });
  }
});

// Get products for a manufacturer
app.get('/api/manufacturers/:manufacturerId/products', async (req, res) => {
  try {
    const { manufacturerId } = req.params;
    const products = await prisma.products.findMany({
      where: { 
        manufacturerId,
        status: 'active'
      },
      select: { 
        productId: true, 
        name: true 
      }
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch products' });
  }
});

// Get product details
app.get('/api/products/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await prisma.products.findUnique({
      where: { productId },
      include: {
        productPricing: {
          where: {
            effectiveDate: { lte: new Date() },
            OR: [
              { endDate: { gte: new Date() } },
              { endDate: null }
            ]
          },
          orderBy: { effectiveDate: 'desc' },
          take: 1
        }
      }
    });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch product details' });
  }
});