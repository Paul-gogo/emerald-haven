import { prisma } from '../config/prisma.js';
import { uploadToCloudinary } from '../utils/uploadToCloudinary.js';

// CREATE Property
export const createProperty = async (req, res) => {
  try {
    const {
      title, location, price, type,
      bedrooms, bathrooms, size,
      description, amenities
    } = req.body;

    if (!req.userEmail) {
      return res.status(400).json({ message: 'User email not found' });
    }

    // Upload images in parallel
    const imageUploadPromises = req.files.map((file, i) =>
      uploadToCloudinary(file.buffer, `property-${Date.now()}-${i}`)
    );
    const imageUrls = await Promise.all(imageUploadPromises);

    const property = await prisma.property.create({
      data: {
        title,
        location,
        price: parseFloat(price),
        type,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        size,
        description,
        amenities: amenities ? JSON.parse(amenities) : [],
        images: imageUrls,
        user: {
          connect: {
            email: req.userEmail,
          },
        },
      },
    });

    res.status(201).json({ property });
  } catch (err) {
    console.error('Error creating property:', err);
    res.status(500).json({ message: 'Failed to create property' });
  }
};

// GET Property By ID - allow any logged-in user to view
export const getPropertyById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid property ID' });

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Ownership check REMOVED to allow all logged-in users access

    res.status(200).json({ property });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch property' });
  }
};

// GET My Properties
export const getMyProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ properties });
  } catch (err) {
    console.error('Error fetching user properties:', err);
    res.status(500).json({ message: 'Failed to fetch your properties' });
  }
};

// UPDATE Property
export const updateProperty = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid property ID' });

    const {
      title, location, price, type,
      bedrooms, bathrooms, size,
      description, amenities
    } = req.body;

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to update this property' });
    }

    let imageUrls = property.images;
    if (req.files && req.files.length > 0) {
      const imageUploadPromises = req.files.map((file, i) =>
        uploadToCloudinary(file.buffer, `property-${Date.now()}-${i}`)
      );
      imageUrls = await Promise.all(imageUploadPromises);
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        title,
        location,
        price: parseFloat(price),
        type,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        size,
        description,
        amenities: JSON.parse(amenities),
        images: imageUrls,
      },
    });

    res.status(200).json(updatedProperty);
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({ message: 'Failed to update property' });
  }
};

// DELETE Property
export const deleteProperty = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid property ID' });

    const property = await prisma.property.findUnique({ where: { id } });
    if (!property) return res.status(404).json({ message: 'Property not found' });

    if (property.userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this property' });
    }

    await prisma.property.delete({ where: { id } });

    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ message: 'Failed to delete property' });
  }
};

// GET All Properties (Public)
export const getAllProperties = async (req, res) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};
