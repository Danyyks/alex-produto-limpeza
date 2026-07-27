import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import type { CategoryConfig } from '../config/categories';

interface CategoryChipsProps {
  categories: CategoryConfig[];
}

export function CategoryChips({ categories }: CategoryChipsProps) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const chipRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const sections = categories
      .map(({ key }) => document.getElementById(`category-${key}`))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveKey(visible[0].target.id.replace('category-', ''));
        }
      },
      { rootMargin: '-160px 0px -70% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [categories]);

  useEffect(() => {
    if (activeKey) {
      chipRefs.current[activeKey]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeKey]);

  return (
    <div className="sticky top-[81px] md:top-[89px] z-20 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map(({ key, label, icon: Icon }) => {
            const isActive = key === activeKey;
            return (
              <motion.a
                key={key}
                ref={(el) => {
                  chipRefs.current[key] = el;
                }}
                href={`#category-${key}`}
                whileTap={{ scale: 0.95 }}
                aria-current={isActive ? 'true' : undefined}
                className={`flex items-center gap-1.5 shrink-0 rounded-full pl-2.5 pr-3.5 py-1.5 border transition-all duration-200 ${
                  isActive
                    ? 'bg-primary border-primary shadow-md'
                    : 'bg-card border-border shadow-sm hover:shadow-md hover:border-primary/30'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? 'text-primary-foreground' : 'text-primary'}`}
                />
                <span
                  className={`text-sm font-medium whitespace-nowrap ${
                    isActive ? 'text-primary-foreground' : 'text-foreground'
                  }`}
                >
                  {label}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
