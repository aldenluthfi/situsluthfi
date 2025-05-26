'use client';

import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';
import { IconChevronDown } from '@tabler/icons-react';
import {
  motion,
  AnimatePresence,
  type Transition,
  type HTMLMotionProps,
} from 'motion/react';

import { cn } from '@/lib/utils';

type AccordionItemContextType = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const AccordionItemContext = React.createContext<
  AccordionItemContextType | undefined
>(undefined);

const useAccordionItem = (): AccordionItemContextType => {
  const context = React.useContext(AccordionItemContext);
  if (!context) {
    throw new Error('useAccordionItem must be used within an AccordionItem');
  }
  return context;
};

type AccordionProps = React.ComponentProps<typeof AccordionPrimitive.Root>;

function Accordion(props: AccordionProps) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

type AccordionItemProps = React.ComponentProps<
  typeof AccordionPrimitive.Item
> & {
  children: React.ReactNode;
};

function AccordionItem({ className, children, ...props }: AccordionItemProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <AccordionItemContext.Provider value={{ isOpen, setIsOpen }}>
      <AccordionPrimitive.Item
        data-slot="accordion-item"
        className={cn('border-b', className)}
        {...props}
      >
        {children}
      </AccordionPrimitive.Item>
    </AccordionItemContext.Provider>
  );
}

type AccordionTriggerProps = React.ComponentProps<
  typeof AccordionPrimitive.Trigger
> & {
  transition?: Transition;
  chevron?: boolean;
};

function AccordionTrigger({
  ref,
  className,
  children,
  transition = { type: 'spring', stiffness: 150, damping: 22 },
  chevron = true,
  ...props
}: AccordionTriggerProps) {
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  React.useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement);
  const { isOpen, setIsOpen } = useAccordionItem();

  React.useEffect(() => {
    const node = triggerRef.current;
    if (!node) return;

    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.attributeName === 'data-state') {
          const currentState = node.getAttribute('data-state');
          setIsOpen(currentState === 'open');
        }
      });
    });
    observer.observe(node, {
      attributes: true,
      attributeFilter: ['data-state'],
    });
    const initialState = node.getAttribute('data-state');
    setIsOpen(initialState === 'open');
    return () => {
      observer.disconnect();
    };
  }, [setIsOpen]);

  return (
    <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
      <AccordionPrimitive.Trigger
        ref={triggerRef}
        data-slot="accordion-trigger"
        className={cn(
          'flex flex-1 text-start items-center justify-between font-medium hover:underline',
          className,
        )}
        {...props}
      >
        {children}

        {chevron && (
          <motion.div
            data-slot="accordion-trigger-chevron"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={transition}
          >
            <IconChevronDown className="size-6 shrink-0" stroke={1.5} />
          </motion.div>
        )}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

type AccordionContentProps = React.ComponentProps<
  typeof AccordionPrimitive.Content
> &
  HTMLMotionProps<'div'> & {
    transition?: Transition;
    horizontal?: boolean;
  };

function AccordionContent({
  className,
  children,
  transition = { type: 'spring', stiffness: 150, damping: 22 },
  horizontal = false,
  ...props
}: AccordionContentProps) {
  const { isOpen } = useAccordionItem();

  const [stage, setStage] = React.useState(0);
  const [measured, setMeasured] = React.useState({ width: 0, height: 0 });
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStage(1);
    } else {
      setStage(0);
    }
  }, [isOpen, horizontal]);

  React.useEffect(() => {
    if (stage === 1 && contentRef.current) {
      setMeasured({
        width: contentRef.current.scrollWidth,
        height: contentRef.current.scrollHeight - 20,
      });
    }
  }, [stage, children, horizontal]);

  React.useEffect(() => {
    if (stage === 1) {
      const timeout = setTimeout(() => setStage(2), 180);
      return () => clearTimeout(timeout);
    }
  }, [stage]);

  let animate;
  if (horizontal) {
    animate =
      stage === 1
        ? { height: measured.height || 'auto', width: 0, opacity: 1, '--mask-stop': '50%' }
        : { height: measured.height || 'auto', width: 'auto', opacity: 1, '--mask-stop': '100%' };
  } else {
    animate =
      stage === 1
        ? { width: measured.width || 'auto', height: 0, opacity: 1, '--mask-stop': '50%' }
        : { width: 'auto', height: measured.height || 'auto', opacity: 1, '--mask-stop': '100%' };
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <AccordionPrimitive.Content forceMount {...props}>
          <motion.div
            key="accordion-content"
            data-slot="accordion-content"
            initial={
              horizontal
                ? { height: 0, width: 0, opacity: 0, '--mask-stop': '0%' }
                : { width: 0, height: 0, opacity: 0, '--mask-stop': '0%' }
            }
            animate={animate}
            exit={
              horizontal
                ? { height: 0, width: 0, opacity: 0, '--mask-stop': '0%' }
                : { width: 0, height: 0, opacity: 0, '--mask-stop': '0%' }
            }
            transition={transition}
            style={
              horizontal
                ? {
                    maskImage:
                      'linear-gradient(to right, black var(--mask-stop), transparent var(--mask-stop))',
                    WebkitMaskImage:
                      'linear-gradient(to right, black var(--mask-stop), transparent var(--mask-stop))',
                  }
                : {
                    maskImage:
                      'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
                    WebkitMaskImage:
                      'linear-gradient(black var(--mask-stop), transparent var(--mask-stop))',
                  }
            }
            className={`overflow-hidden ${horizontal ? "h-min" : ""}`}
            {...props}
          >
            <div
              ref={contentRef}
              className={cn('text-sm -pb-5', className)}
            >
              {children}
            </div>
          </motion.div>
        </AccordionPrimitive.Content>
      )}
    </AnimatePresence>
  );
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  useAccordionItem,
  type AccordionItemContextType,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionTriggerProps,
  type AccordionContentProps,
};
