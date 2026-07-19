import fs from 'fs';
import path from 'path';

// Minimal parser to handle nested quotes correctly in CSV
function parseCSV(content) {
  const lines = [];
  let row = [];
  let inQuotes = false;
  let currentVal = '';

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentVal += '"';
        i++;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentVal.trim());
      if (row.some(val => val !== '')) {
        lines.push(row);
      }
      row = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    if (row.some(val => val !== '')) {
      lines.push(row);
    }
  }
  return lines;
}

const csvPath = 'd:/TechCognita/Coffee_Project/Copy of Recipe and Method - Sheet3.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const rows = parseCSV(csvContent);

// Headers: Sr. No, Name, Description, Mood, Tags, Ingredient, Recipe, Concentrate, IMG
const headers = rows[0].map(h => h.toLowerCase().trim());
console.log('Detected headers:', headers);

// Read list of files in Recipes and Images directory
const recipesImagesDir = 'd:/TechCognita/Coffee_Project/public/images/Recipes';
const generalImagesDir = 'd:/TechCognita/Coffee_Project/public/images/Images';

const recipesImages = fs.existsSync(recipesImagesDir) ? fs.readdirSync(recipesImagesDir) : [];
const generalImages = fs.existsSync(generalImagesDir) ? fs.readdirSync(generalImagesDir) : [];

function findExistingImage(recipeName) {
  // Try clean alphanumeric match
  const cleanName = recipeName.toLowerCase().replace(/[^a-z0-9]/g, '');

  // Try matching directly in Recipes folder first
  for (const img of recipesImages) {
    const cleanImg = img.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/g, '');
    if (cleanName === cleanImg || cleanImg.includes(cleanName) || cleanName.includes(cleanImg)) {
      return `/images/Recipes/${img}`;
    }
  }

  // Try matching in general Images folder next
  for (const img of generalImages) {
    const cleanImg = img.toLowerCase().replace(/\.[^/.]+$/, '').replace(/[^a-z0-9]/g, '');
    if (cleanName === cleanImg || cleanImg.includes(cleanName) || cleanName.includes(cleanImg)) {
      return `/images/Images/${img}`;
    }
  }

  // Handle specific manual overrides/mappings if needed
  if (recipeName.toLowerCase() === 'cold brew') {
    return '/images/COLD BREW.png';
  }

  return null;
}

const recipes = [];
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (row.length < 2 || !row[1]) continue; // Needs a name

  // Skip comments or empty rows
  if (row[0] && row[0].startsWith('#')) continue;

  const srNo = row[0] || '';
  const name = row[1] || '';
  const description = row[2] || '';
  const mood = row[3] || '';
  const tagsRaw = row[4] || '';
  const ingredientsRaw = row[5] || '';
  const stepsRaw = row[6] || '';
  const concentrateRaw = row[7] || '';

  // Clean tags
  const tags = tagsRaw
    .split(/[\r\n,]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  // Clean ingredients
  const ingredients = ingredientsRaw
    .split(/[\r\n]+/)
    .map(ing => ing.trim())
    .filter(ing => ing.length > 0);

  // Clean steps
  const steps = stepsRaw
    .split(/[\r\n]+/)
    .map((step, idx) => {
      // Remove step prefix e.g., "1. ", "Step 1: "
      const cleanStep = step.replace(/^\d+[\.\:\)]\s*/, '').trim();
      return {
        title: `Step ${idx + 1}`,
        copy: cleanStep
      };
    })
    .filter(s => s.copy.length > 0);

  // Derive concentrate type
  let concentrate = 'Classic';
  if (concentrateRaw.toLowerCase().includes('bold')) {
    concentrate = 'Bold';
  } else if (concentrateRaw.toLowerCase().includes('kappi')) {
    concentrate = 'Kappi';
  } else if (concentrateRaw.toLowerCase().includes('cascara')) {
    concentrate = 'Cascara';
  } else if (concentrateRaw.toLowerCase().includes('cxr') || concentrateRaw.toLowerCase().includes('chicory')) {
    concentrate = 'Chicory';
  } else if (concentrateRaw.toLowerCase().includes('coconut')) {
    concentrate = 'Coconut';
  }

  // Derive unique ID
  const idBase = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const id = `${idBase}-${Math.random().toString(36).substring(2, 7)}`;

  // Find existing image or fallback
  const matchedImage = findExistingImage(name);
  const image = matchedImage || '/images/georgesso-hero.png';
  const mediaMatch = matchedImage ? 'exact' : 'fallback';

  // Random like counts
  const likes = `${Math.floor(Math.random() * 400) + 100} Likes`;

  recipes.push({
    id,
    name,
    description,
    mood,
    tags,
    concentrate,
    ingredients,
    steps,
    image,
    video: '',
    mediaMatch,
    likes,
    author: 'CHILLD Lab'
  });
}

const outputPath = 'd:/TechCognita/Coffee_Project/src/data/recipes.js';
const jsOutput = `// =====================================================
// CHILLD COFFEE - Recipes Catalog (Generated)
// =====================================================

export const RECIPE_IMAGE_FALLBACK = '/images/georgesso-hero.png';

export const RECIPES = ${JSON.stringify(recipes, null, 2)};
`;

fs.writeFileSync(outputPath, jsOutput, 'utf-8');
console.log(`Successfully generated ${recipes.length} recipes to ${outputPath}`);
