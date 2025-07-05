// Common animation variants used across admin components
import { Variants } from "framer-motion"

export const containerVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1
    }
  }
}

export const itemVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: -20 
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export const tableRowVariants: Variants = {
  hidden: { 
    opacity: 0,
    x: 20 
  },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      delay: index * 0.1,
      ease: "easeOut"
    }
  }),
  exit: { 
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
}

export const fadeInVariants: Variants = {
  hidden: { 
    opacity: 0 
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
}

export const slideUpVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 30 
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -30,
    transition: {
      duration: 0.3
    }
  }
}

export const scaleInVariants: Variants = {
  hidden: { 
    opacity: 0,
    scale: 0.95 
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.15
    }
  }
}

// Helper functions for common motion props
export const getStaggeredTableProps = (index: number) => ({
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  custom: index,
  variants: tableRowVariants
})

export const getContainerMotionProps = () => ({
  initial: "hidden",
  animate: "visible",
  variants: containerVariants
})

export const getItemMotionProps = () => ({
  initial: "hidden",
  animate: "visible",
  variants: itemVariants
})