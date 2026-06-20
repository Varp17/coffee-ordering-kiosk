import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { CONCENTRATES } from '@/data/ingredients';
import IngredientCard from '@/components/IngredientCard/IngredientCard';
import { containerVariants, itemVariants } from '@/utils/animations';
import '../StepLayout.css';

export default function Step1Concentrate() {
  const { concentrate, setConcentrate } = useBuilderStore();

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">🌱</span>
        <h2 className="step-layout__title">Choose your Base</h2>
        <p className="step-layout__desc">
          Your brew starts here. What's the soul of your drink?
        </p>
      </div>

      <motion.div
        className="step-layout__grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {CONCENTRATES.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <IngredientCard
              item={item}
              selected={concentrate}
              onSelect={setConcentrate}
              type="concentrate"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
