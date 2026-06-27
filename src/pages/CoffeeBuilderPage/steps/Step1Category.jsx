import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { BUILDER_CATEGORIES } from '@/data/ingredients';
import IngredientCard from '@/components/IngredientCard/IngredientCard';
import { containerVariants, itemVariants } from '@/utils/animations';
import '../StepLayout.css';

export default function Step1Category() {
  const { category, setCategory } = useBuilderStore();

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🌡️</span>
        <h2 className="step-layout__title">Pick your Style</h2>
        <p className="step-layout__desc">
          Do you want it chilled, hot, or served on the rocks?
        </p>
      </div>

      <motion.div
        className="step-layout__grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {BUILDER_CATEGORIES.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <IngredientCard
              item={item}
              selected={category}
              onSelect={setCategory}
              type="category"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
