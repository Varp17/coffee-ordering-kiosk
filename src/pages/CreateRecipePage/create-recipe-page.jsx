import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Plus,
  Tag,
  Upload,
  X,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { api } from '@/services/api';
import './create-recipe-page.css';

const DEFAULT_IMAGE = '/images/image11_366_1172.png';
const CONCENTRATE_OPTIONS = ['Classic', 'Bold', 'Kappi'];

const getConcentrateImage = (conc) => {
  const c = (conc || '').toLowerCase();
  if (c.includes('bold')) return '/images/products/BoldConcentrate325.png';
  if (c.includes('kappi') || c.includes('kaapi') || c.includes('chicory')) return '/images/products/KappiConcentrate325.png';
  return '/images/products/ClassicCBConc325.png';
};

export default function CreateRecipePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(DEFAULT_IMAGE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recipeName, setRecipeName] = useState('');
  const [description, setDescription] = useState('');
  const [mood, setMood] = useState('Chill');
  const [selectedConcentrate, setSelectedConcentrate] = useState('Classic');
  const [tags, setTags] = useState(['COLD BREW', 'HOMEMADE']);
  const [tagInput, setTagInput] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  
  // Recipe Steps
  const [steps, setSteps] = useState([
    { title: 'Step 1', copy: '' },
    { title: 'Step 2', copy: '' }
  ]);

  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const setPreviewFromFile = (file) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setStatus('Please select a PNG, JPG, JPEG, or WEBP image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setStatus('Image size must be 5 MB or smaller.');
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    setImageSrc(nextPreview);
    setStatus('Image selected.');
  };

  const handleFileChange = (event) => setPreviewFromFile(event.target.files?.[0]);

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    setPreviewFromFile(event.dataTransfer.files?.[0]);
  };

  const addTag = () => {
    const nextTag = tagInput.trim().toUpperCase();
    if (!nextTag || tags.includes(nextTag)) return;
    setTags((current) => [...current, nextTag]);
    setTagInput('');
  };

  const addIngredient = (customText) => {
    const textToAdd = (typeof customText === 'string' ? customText : ingredientInput).trim();
    if (!textToAdd) return;
    setIngredients((current) => [...current, textToAdd]);
    if (typeof customText !== 'string') {
      setIngredientInput('');
    }
  };

  const addConcentrateIngredient = (concType) => {
    setSelectedConcentrate(concType);
    const text = `90 ml Chilld ${concType} Concentrate`;
    if (!ingredients.includes(text)) {
      setIngredients((prev) => [...prev, text]);
    }
  };

  const updateStep = (index, field, value) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addStep = () => {
    setSteps((prev) => [...prev, { title: `Step ${prev.length + 1}`, copy: '' }]);
  };

  const removeStep = (index) => {
    if (steps.length <= 1) return;
    setSteps((prev) => prev.filter((_, i) => i !== index));
  };

  const publishRecipe = async () => {
    if (!recipeName.trim()) {
      toast.error('Please enter a name for your recipe');
      return;
    }

    let defaultImage = getConcentrateImage(selectedConcentrate);

    // 1. Upload photo if selected
    if (selectedFile) {
      try {
        toast.loading('Uploading recipe photo...', { id: 'recipe-upload' });
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('folder', 'recipes');
        const uploadRes = await api.post('/upload/s3', formData);
        const returnedUrl = uploadRes?.data?.url || uploadRes?.url;
        if (returnedUrl) {
          defaultImage = returnedUrl;
          toast.success('Photo uploaded!', { id: 'recipe-upload' });
        }
      } catch (err) {
        console.warn('Recipe image upload error:', err);
        toast.error('Image upload failed, using default concentrate image.', { id: 'recipe-upload' });
      }
    }

    const newRecipe = {
      id: `custom-mix-${Date.now()}`,
      name: recipeName.trim(),
      description: description.trim() || `Custom brew created with ${selectedConcentrate} concentrate.`,
      author: 'User Mixologist',
      concentrate: selectedConcentrate,
      status: 'pending',
      is_published: false,
      mood: mood || 'Chill',
      tags: tags.length > 0 ? tags : ['CUSTOM MIX', selectedConcentrate.toUpperCase()],
      likesCount: 0,
      createdAt: new Date().toISOString(),
      ingredients: ingredients.length > 0 ? ingredients : [`90 ml Chilld ${selectedConcentrate} Concentrate`],
      steps: steps.map((s, idx) => ({
        title: s.title || `Step ${idx + 1}`,
        copy: s.copy || ''
      })),
      image: defaultImage,
    };

    // 2. Save to local storage for instant offline / CRM sync
    try {
      const PENDING_KEY = 'chilld_local_pending_recipes';
      const raw = localStorage.getItem(PENDING_KEY);
      const existing = raw ? JSON.parse(raw) : [];
      const updated = [newRecipe, ...existing];
      localStorage.setItem(PENDING_KEY, JSON.stringify(updated));

      // Broadcast events to update CRM in real-time
      window.dispatchEvent(new Event('recipes:updated'));
      if ('BroadcastChannel' in window) {
        const bc = new BroadcastChannel('chilld_recipe_channel');
        bc.postMessage({ type: 'RECIPE_ADDED', recipe: newRecipe });
        bc.close();
      }
    } catch (e) {
      console.warn('Local recipe storage error:', e);
    }

    // 3. Post to backend API
    try {
      await api.post('/recipes', {
        name: newRecipe.name,
        description: newRecipe.description,
        concentrate: newRecipe.concentrate,
        mood: newRecipe.mood,
        tags: newRecipe.tags,
        ingredients: newRecipe.ingredients,
        steps: newRecipe.steps,
        image: newRecipe.image,
      });
    } catch (_) {
      // Non-blocking
    }

    setIsSuccessModalOpen(true);
  };

  const handleConfirmRedirect = () => {
    setIsSuccessModalOpen(false);
    navigate('/recipes');
  };

  return (
    <main className="create-recipe-page">
      {/* ── HERO HEADER ── */}
      <section className="create-recipe-hero" aria-labelledby="create-recipe-title">
        <div className="create-recipe-hero__graffiti" aria-hidden="true" />
        <div className="create-recipe-shell create-recipe-hero__content">
          <p className="create-recipe-hero__eyebrow">COMMUNITY RECIPE STUDIO</p>
          <h1 id="create-recipe-title">Code Your Vibe</h1>
          <p>Share your recipe with the CHILLD community.</p>
        </div>
      </section>

      <section className="create-recipe-shell create-recipe-workspace" aria-label="Create your coffee recipe">
        {/* ── MEDIA & DETAILS CONFIGURATION ── */}
        <div className="create-recipe-workspace__top">
          <div className="create-recipe-media-column">
            <input
              ref={fileInputRef}
              className="create-recipe-file-input"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              aria-label="Upload recipe photo"
            />

            <button
              type="button"
              className={`create-recipe-dropzone ${isDragging ? 'is-dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(event) => event.preventDefault()}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <Upload size={30} strokeWidth={1.8} />
              <strong>Drop File Here or Upload File</strong>
              <span>5 MB File Size Limit (PNG, JPEG, WEBP)</span>
            </button>

            <div className="create-recipe-preview">
              <button
                className="create-recipe-preview__remove"
                type="button"
                aria-label="Remove uploaded image"
                onClick={() => {
                  if (previewUrl) URL.revokeObjectURL(previewUrl);
                  setPreviewUrl(null);
                  setImageSrc(DEFAULT_IMAGE);
                  setStatus('Default drink image restored.');
                }}
              >
                <X size={18} />
              </button>
              <img src={imageSrc} alt="Recipe preview" />
            </div>
          </div>

          <div className="create-recipe-fields">
            <label className="create-recipe-field">
              <span>Give your recipe a name</span>
              <input
                value={recipeName}
                onChange={(event) => setRecipeName(event.target.value)}
                placeholder="Ex. Johpresso"
                maxLength={48}
              />
            </label>

            <label className="create-recipe-field">
              <span>Description</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Share your thoughts..."
                maxLength={280}
              />
            </label>

            <label className="create-recipe-field">
              <span>Mood Selector</span>
              <span className="create-recipe-select-wrap">
                <select value={mood} onChange={(event) => setMood(event.target.value)}>
                  <option>Chill</option>
                  <option>Focused</option>
                  <option>Cozy</option>
                  <option>Electric</option>
                  <option>Slow Sunday</option>
                </select>
                <ChevronDown size={18} aria-hidden="true" />
              </span>
            </label>

            <div className="create-recipe-field">
              <span>Enter Tags</span>
              <div className="create-recipe-tags-box">
                <div className="create-recipe-tags-list">
                  {tags.map((tag) => (
                    <button
                      type="button"
                      className="create-recipe-tag"
                      key={tag}
                      onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                      title={`Remove ${tag}`}
                    >
                      {tag}
                      <X size={13} />
                    </button>
                  ))}
                </div>
                <div className="create-recipe-tags-entry">
                  <Tag size={15} aria-hidden="true" />
                  <input
                    value={tagInput}
                    onChange={(event) => setTagInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        addTag();
                      }
                    }}
                    placeholder="Add a tag"
                  />
                  <button type="button" onClick={addTag} aria-label="Add tag">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── INGREDIENTS & STEPS EDITOR ── */}
        <div className="create-recipe-workspace__bottom">
          {/* Ingredients Section */}
          <section className="create-recipe-editor-card create-recipe-ingredients" aria-labelledby="ingredients-title">
            <div className="create-recipe-editor-card__heading">
              <h2 id="ingredients-title">Ingredients</h2>
            </div>

            {/* Concentrate Selector Buttons (Feature 13b) */}
            <div className="create-recipe-conc-selector">
              <span className="conc-selector-label">Select Concentrate Base:</span>
              <div className="conc-buttons-row">
                {CONCENTRATE_OPTIONS.map((conc) => (
                  <button
                    key={conc}
                    type="button"
                    className={`conc-btn ${selectedConcentrate === conc ? 'is-selected' : ''}`}
                    onClick={() => addConcentrateIngredient(conc)}
                  >
                    + Add {conc} Concentrate
                  </button>
                ))}
              </div>
            </div>

            <div className="create-recipe-ingredients-box">
              {ingredients.length === 0 ? (
                <p className="ingredients-empty-prompt">No ingredients added yet. Select a concentrate base above or add custom ingredients below.</p>
              ) : (
                <ul>
                  {ingredients.map((ingredient, index) => (
                    <li key={`${ingredient}-${index}`}>
                      <span className="ingredient-text">{ingredient}</span>
                      <button
                        type="button"
                        onClick={() => setIngredients((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        aria-label={`Remove ${ingredient}`}
                      >
                        <X size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="create-recipe-ingredients__entry">
              <input
                value={ingredientInput}
                onChange={(event) => setIngredientInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addIngredient();
                  }
                }}
                placeholder="Add an ingredient (e.g. 15ml Jaggery syrup, Ice cubes)"
              />
              <button type="button" onClick={() => addIngredient()}>
                <Plus size={16} /> Add
              </button>
            </div>
          </section>

          {/* Proper Recipe Steps Section (Feature 13) */}
          <section className="create-recipe-editor-card create-recipe-steps-editor" aria-labelledby="steps-title">
            <div className="create-recipe-editor-card__heading">
              <h2 id="steps-title">Recipe Steps</h2>
            </div>
            
            <div className="create-recipe-steps-list">
              {steps.map((step, idx) => (
                <div key={idx} className="step-builder-item">
                  <div className="step-builder-header">
                    <span className="step-number">{step.title}</span>
                    {steps.length > 1 && (
                      <button
                        type="button"
                        className="step-remove-btn"
                        onClick={() => removeStep(idx)}
                        title="Remove step"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <textarea
                    className="step-text-input"
                    value={step.copy}
                    onChange={(e) => updateStep(idx, 'copy', e.target.value)}
                    placeholder={`Describe ${step.title} (e.g. Fill glass with ice cubes)...`}
                    rows={2}
                  />
                </div>
              ))}

              <button type="button" className="add-step-btn" onClick={addStep}>
                <Plus size={16} /> Add Step
              </button>
            </div>
          </section>
        </div>

        {/* ── PUBLISH CONTROL ── */}
        <div className="create-recipe-publish-row">
          <button type="button" className="create-recipe-publish" onClick={publishRecipe}>
            Publish Your Mix
          </button>
          {status && <p role="status" aria-live="polite">{status}</p>}
        </div>
      </section>

      {/* ── PUBLISH SUCCESS CONFIRMATION MODAL (Feature 14) ── */}
      {isSuccessModalOpen && (
        <div className="recipe-modal-backdrop">
          <div className="recipe-modal-card">
            <div className="recipe-modal-icon">
              <CheckCircle2 size={44} />
            </div>
            <h3>Thank You!</h3>
            <p>Thank you for sharing your recipe. It will be published after review.</p>
            <button type="button" className="recipe-modal-confirm-btn" onClick={handleConfirmRedirect}>
              Back to Recipes Page
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
