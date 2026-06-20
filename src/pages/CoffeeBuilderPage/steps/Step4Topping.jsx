import { motion } from 'framer-motion';
import { useBuilderStore } from '@/store/useBuilderStore';
import { TOPPINGS } from '@/data/ingredients';
import IngredientCard from '@/components/IngredientCard/IngredientCard';
import { containerVariants, itemVariants } from '@/utils/animations';
import '../StepLayout.css';

export default function Step4Topping() {
  const { topping, setTopping } = useBuilderStore();

  return (
    <div className="step-layout">
      <div className="step-layout__header">
        <span className="step-layout__emoji">✨</span>
        <h2 className="step-layout__title">Choose a Topping</h2>
        <p className="step-layout__desc">
          Add the finishing touch to your drink. What goes on top?
        </p>
      </div>

      <motion.div
        className="step-layout__grid"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {TOPPINGS.map((item) => (
          <motion.div key={item.id} variants={itemVariants}>
            <IngredientCard
              item={item}
              selected={topping}
              onSelect={setTopping}
              type="topping"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
