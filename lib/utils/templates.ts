export type TemplateType = 'mobile-app' | 'i18n' | 'ab-test' | 'design';

export interface Template {
  type: TemplateType;
  name: string;
  description: string;
  json: Record<string, any>;
}

export const templates: Template[] = [
  {
    type: 'mobile-app',
    name: 'Mobile App Parameters',
    description: 'Feature flags and app configuration parameters',
    json: {
      feature_flags: {
        enable_new_ui: false,
        enable_dark_mode: true,
        enable_push_notifications: true,
      },
      app_settings: {
        max_retry_count: 3,
        timeout_seconds: 30,
        cache_duration_hours: 24,
      },
      api_endpoints: {
        base_url: 'https://api.example.com',
        version: 'v1',
      },
    },
  },
  {
    type: 'i18n',
    name: 'Internationalization (i18n)',
    description: 'Translation keys and localized content',
    json: {
      en: {
        welcome: 'Welcome',
        goodbye: 'Goodbye',
        error: 'An error occurred',
        success: 'Operation completed successfully',
      },
      tr: {
        welcome: 'Hoş geldiniz',
        goodbye: 'Güle güle',
        error: 'Bir hata oluştu',
        success: 'İşlem başarıyla tamamlandı',
      },
      es: {
        welcome: 'Bienvenido',
        goodbye: 'Adiós',
        error: 'Ocurrió un error',
        success: 'Operación completada con éxito',
      },
    },
  },
  {
    type: 'ab-test',
    name: 'A/B Test Configuration',
    description: 'Experiment variants and user segmentation',
    json: {
      experiments: {
        homepage_layout: {
          enabled: true,
          variants: ['control', 'variant_a', 'variant_b'],
          traffic_split: {
            control: 0.33,
            variant_a: 0.33,
            variant_b: 0.34,
          },
        },
        checkout_flow: {
          enabled: false,
          variants: ['standard', 'simplified'],
          traffic_split: {
            standard: 0.5,
            simplified: 0.5,
          },
        },
      },
      user_segments: {
        beta_users: {
          experiments: ['homepage_layout'],
          variant_override: {
            homepage_layout: 'variant_b',
          },
        },
      },
    },
  },
  {
    type: 'design',
    name: 'Design Tokens',
    description: 'Design system tokens and theme configuration',
    json: {
      colors: {
        primary: '#111827',
        secondary: '#6B7280',
        success: '#10B981',
        error: '#EF4444',
        warning: '#F59E0B',
        background: '#FFFFFF',
        surface: '#F9FAFB',
      },
      typography: {
        font_family: 'system-ui, -apple-system, sans-serif',
        font_sizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
        },
        font_weights: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
    },
  },
];

export function getTemplate(type: TemplateType): Template | undefined {
  return templates.find((t) => t.type === type);
}

