import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { SWEETENERS } from '@/data/ingredients';
import IngredientCard from '@/components/IngredientCard/IngredientCard';
import { containerVariants, itemVariants } from '@/utils/animations';
import '../StepLayout.css';

export default function Step2Sweetener() {
  const { sweetener, setSweetener } = useBuilderStore();
  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🍯</span>
        <h2 className="step-layout__title">Pick your Sweetener</h2>
        <p className="step-layout__desc">How sweet should your life be?</p>
      </div>
      <motion.div className="step-layout__grid" variants={containerVariants} initial="hidden" animate="show">
        {SWEETENERS.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <IngredientCard item={item} selected={sweetener} onSelect={setSweetener} type="sweetener" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
