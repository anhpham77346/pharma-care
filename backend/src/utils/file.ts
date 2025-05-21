import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Check if the directory exists, if not create it
const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Save a base64 image to the specified directory
 * @param base64Data - The base64 encoded image data
 * @param directory - Directory to save the file to
 * @param filenamePrefix - Optional prefix for the filename
 * @returns The URL path to the saved file
 */
export const saveBase64Image = (
  base64Data: string,
  directory: string,
  filenamePrefix: string = 'image'
): string => {
  // Strip out the data:image/jpeg;base64, part if present
  const base64Image = base64Data.split(';base64,').pop();
  
  if (!base64Image) {
    throw new Error('Invalid base64 image data');
  }

  // Ensure the directory exists
  ensureDirectoryExists(directory);
  
  // Generate a unique filename
  const filename = `${filenamePrefix}-${uuidv4()}.jpg`;
  const filePath = path.join(directory, filename);
  
  // Write the file
  fs.writeFileSync(filePath, base64Image, { encoding: 'base64' });
  
  // Return the relative path from the project root
  return `/files/${filename}`;
};

/**
 * Delete a file at the specified path
 * @param filePath - The path to the file to be deleted
 * @returns boolean indicating if deletion was successful
 */
export const deleteFile = (filePath: string): boolean => {
  try {
    // Get the absolute path by removing the leading / and joining with process.cwd()
    const absolutePath = path.join(process.cwd(), filePath.replace(/^\//, ''));
    
    // Check if file exists before attempting to delete
    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}; 