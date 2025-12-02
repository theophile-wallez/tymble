import { AnimatePresence, motion } from 'motion/react';
import { useMemo } from 'react';
import { cn } from '@/ui/utils';

type Props = {
  word: string;
} & React.ComponentProps<'p'>;

export const SmoothWord = ({ word, className, ...props }: Props) => {
  const characters = useMemo(() => {
    const entities = word.split('').map((ch) => ch.toLowerCase());
    const characters: { label: string; id: string }[] = [];

    for (let index = 0; index < entities.length; index++) {
      const entity = entities[index];
      const count = entities.slice(0, index).filter((e) => e === entity).length;

      characters.push({
        id: `${entity}${count + 1}`,
        label: characters.length === 0 ? entity.toUpperCase() : entity,
      });
    }

    return characters;
  }, [word]);

  return (
    <p className={cn('flex gap-0.5', className)} {...props}>
      <AnimatePresence mode="popLayout">
        {characters.map((character) => (
          <motion.span
            animate={{ opacity: 1 }}
            className="inline-block"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key={character.id}
            layout="position"
            layoutId={character.id}
            transition={{
              type: 'spring',
              bounce: 0.1,
              duration: 0.2,
            }}
          >
            {character.label}
          </motion.span>
        ))}
      </AnimatePresence>
    </p>
  );
};
