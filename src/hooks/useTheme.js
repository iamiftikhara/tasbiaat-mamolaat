import { useMemo } from 'react';
import themeConfig from '../config/theme.json';

export const useTheme = () => {
  const theme = useMemo(() => {
    return {
      ...themeConfig,
      config: themeConfig,
      // Helper functions for easier access
      getColor: (colorPath) => {
        const keys = colorPath.split('.');
        let value = themeConfig.colors;
        for (const key of keys) {
          value = value[key];
          if (!value) return null;
        }
        return value;
      },
      getColorRGB: (colorName, shade) => {
        const color = themeConfig.colors[colorName]?.[shade];
        if (!color) return '0, 0, 0';
        // Convert hex to RGB
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        return `${r}, ${g}, ${b}`;
      },
      getGradient: (gradientName) => {
        return themeConfig.gradients[gradientName] || themeConfig.gradients.primary;
      },
      getShadow: (shadowName) => {
        return themeConfig.shadows[shadowName] || themeConfig.shadows.base;
      },
      getFont: (fontType = 'primary') => {
        return themeConfig.typography.fontFamily[fontType] || themeConfig.typography.fontFamily.primary;
      },
      getSpacing: (size) => {
        return themeConfig.spacing[size] || size;
      },
      getRadius: (size) => {
        return themeConfig.borderRadius[size] || themeConfig.borderRadius.base;
      }
    };
  }, []);

  return theme;
};

// CSS Custom Properties Generator
export const generateCSSVariables = () => {
  const cssVars = {};
  
  // Colors
  Object.entries(themeConfig.colors).forEach(([colorName, colorShades]) => {
    if (typeof colorShades === 'object') {
      Object.entries(colorShades).forEach(([shade, value]) => {
        cssVars[`--color-${colorName}-${shade}`] = value;
      });
    }
  });
  
  // Gradients
  Object.entries(themeConfig.gradients).forEach(([name, value]) => {
    cssVars[`--gradient-${name}`] = value;
  });
  
  // Shadows
  Object.entries(themeConfig.shadows).forEach(([name, value]) => {
    cssVars[`--shadow-${name}`] = value;
  });
  
  // Typography
  Object.entries(themeConfig.typography.fontFamily).forEach(([name, value]) => {
    cssVars[`--font-${name}`] = value;
  });
  
  Object.entries(themeConfig.typography.fontSize).forEach(([name, value]) => {
    cssVars[`--text-${name}`] = value;
  });
  
  // Spacing
  Object.entries(themeConfig.spacing).forEach(([name, value]) => {
    cssVars[`--spacing-${name}`] = value;
  });
  
  // Border Radius
  Object.entries(themeConfig.borderRadius).forEach(([name, value]) => {
    cssVars[`--radius-${name}`] = value;
  });
  
  return cssVars;
};

export default useTheme;