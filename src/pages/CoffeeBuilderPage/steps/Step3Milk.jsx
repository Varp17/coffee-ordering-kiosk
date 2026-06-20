import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { MILKS } from '@/data/ingredients';
import IngredientCard from '@/components/IngredientCard/IngredientCard';
import { containerVariants, itemVariants } from '@/utils/animations';
import '../StepLayout.css';

export default function Step3Milk() {
  const { milk, setMilk } = useBuilderStore();
  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🥛</span>
        <h2 className="step-layout__title">Select your Milk</h2>
        <p className="step-layout__desc">The texture, creaminess and character of your brew.</p>
      </div>
      <motion.div className="step-layout__grid" variants={containerVariants} initial="hidden" animate="show">
        {MILKS.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <IngredientCard item={item} selected={milk} onSelect={setMilk} type="milk" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
