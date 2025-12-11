export type TemplateType = 
  | 'mobile-app' 
  | 'i18n' 
  | 'ab-test' 
  | 'design'
  | 'api-config'
  | 'payment'
  | 'analytics'
  | 'notifications'
  | 'security'
  | 'content'
  | 'performance'
  | 'integration'
  | 'business-rules'
  | 'environment';

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
  {
    type: 'api-config',
    name: 'API Configuration',
    description: 'API endpoints, rate limits, and service configuration',
    json: {
      endpoints: {
        base_url: 'https://api.example.com',
        version: 'v1',
        timeout_ms: 30000,
        retry_attempts: 3,
      },
      rate_limiting: {
        enabled: true,
        requests_per_minute: 100,
        requests_per_hour: 1000,
        burst_limit: 20,
      },
      authentication: {
        method: 'bearer_token',
        token_expiry_hours: 24,
        refresh_enabled: true,
      },
      caching: {
        enabled: true,
        ttl_seconds: 300,
        cache_keys: ['user_profile', 'app_settings'],
      },
    },
  },
  {
    type: 'payment',
    name: 'Payment & Billing',
    description: 'Payment gateway configuration and pricing tiers',
    json: {
      payment_gateways: {
        stripe: {
          enabled: true,
          public_key: 'pk_test_...',
          currency: 'USD',
          supported_methods: ['card', 'apple_pay', 'google_pay'],
        },
        paypal: {
          enabled: false,
          mode: 'sandbox',
        },
      },
      pricing_tiers: {
        free: {
          price: 0,
          features: ['basic_features', 'limited_storage'],
        },
        pro: {
          price: 29.99,
          features: ['all_features', 'unlimited_storage', 'priority_support'],
        },
        enterprise: {
          price: 99.99,
          features: ['all_features', 'custom_integrations', 'dedicated_support'],
        },
      },
      billing: {
        billing_cycle: 'monthly',
        trial_days: 14,
        grace_period_days: 7,
        auto_renewal: true,
      },
    },
  },
  {
    type: 'analytics',
    name: 'Analytics & Tracking',
    description: 'Analytics services and event tracking configuration',
    json: {
      providers: {
        google_analytics: {
          enabled: true,
          tracking_id: 'UA-XXXXXXXXX-X',
          anonymize_ip: true,
        },
        mixpanel: {
          enabled: true,
          project_token: 'your_token_here',
          track_pageviews: true,
        },
        amplitude: {
          enabled: false,
          api_key: 'your_api_key',
        },
      },
      events: {
        track_user_actions: true,
        track_page_views: true,
        track_errors: true,
        track_performance: true,
      },
      privacy: {
        gdpr_compliant: true,
        anonymize_user_data: true,
        data_retention_days: 365,
      },
    },
  },
  {
    type: 'notifications',
    name: 'Notifications',
    description: 'Push, email, and SMS notification settings',
    json: {
      push_notifications: {
        enabled: true,
        providers: {
          fcm: {
            enabled: true,
            server_key: 'your_server_key',
          },
          apns: {
            enabled: true,
            bundle_id: 'com.example.app',
          },
        },
        default_channels: ['marketing', 'updates', 'alerts'],
      },
      email: {
        enabled: true,
        provider: 'sendgrid',
        from_address: 'noreply@example.com',
        templates: {
          welcome: 'welcome_email_template_id',
          password_reset: 'password_reset_template_id',
        },
      },
      sms: {
        enabled: false,
        provider: 'twilio',
        from_number: '+1234567890',
      },
      preferences: {
        quiet_hours_start: '22:00',
        quiet_hours_end: '08:00',
        timezone: 'UTC',
      },
    },
  },
  {
    type: 'security',
    name: 'Security Policies',
    description: 'Security settings, rate limiting, and access controls',
    json: {
      authentication: {
        password_min_length: 8,
        require_uppercase: true,
        require_lowercase: true,
        require_numbers: true,
        require_special_chars: true,
        password_expiry_days: 90,
        max_login_attempts: 5,
        lockout_duration_minutes: 30,
      },
      session: {
        session_timeout_minutes: 60,
        remember_me_days: 30,
        require_mfa: false,
        mfa_methods: ['totp', 'sms'],
      },
      rate_limiting: {
        login_attempts_per_minute: 5,
        api_requests_per_minute: 100,
        password_reset_per_hour: 3,
      },
      ip_whitelist: {
        enabled: false,
        allowed_ips: [],
      },
      cors: {
        enabled: true,
        allowed_origins: ['https://app.example.com'],
        allowed_methods: ['GET', 'POST', 'PUT', 'DELETE'],
      },
    },
  },
  {
    type: 'content',
    name: 'Content Management',
    description: 'CMS-like content configuration and editorial settings',
    json: {
      content_types: {
        articles: {
          enabled: true,
          max_length: 5000,
          allowed_formats: ['markdown', 'html'],
        },
        pages: {
          enabled: true,
          require_approval: true,
        },
        media: {
          max_file_size_mb: 10,
          allowed_formats: ['jpg', 'png', 'gif', 'pdf'],
        },
      },
      editorial: {
        moderation_enabled: true,
        auto_publish: false,
        review_required: true,
        max_revisions: 10,
      },
      seo: {
        auto_generate_meta: true,
        default_keywords: ['example', 'content'],
        canonical_urls: true,
      },
    },
  },
  {
    type: 'performance',
    name: 'Performance & Caching',
    description: 'Cache settings, CDN configuration, and performance tuning',
    json: {
      caching: {
        enabled: true,
        strategy: 'redis',
        default_ttl_seconds: 3600,
        cache_keys: {
          user_data: 1800,
          app_config: 3600,
          static_content: 86400,
        },
      },
      cdn: {
        enabled: true,
        provider: 'cloudflare',
        cache_static_assets: true,
        cache_duration_hours: 24,
      },
      optimization: {
        image_compression: true,
        lazy_loading: true,
        minify_css: true,
        minify_js: true,
        enable_gzip: true,
      },
      monitoring: {
        track_page_load: true,
        track_api_response_time: true,
        slow_query_threshold_ms: 1000,
      },
    },
  },
  {
    type: 'integration',
    name: 'Third-Party Integrations',
    description: 'External service integrations and API connections',
    json: {
      services: {
        slack: {
          enabled: true,
          webhook_url: 'https://hooks.slack.com/...',
          channels: ['alerts', 'notifications'],
        },
        zapier: {
          enabled: false,
          api_key: 'your_api_key',
        },
        webhooks: {
          enabled: true,
          endpoints: [
            {
              url: 'https://example.com/webhook',
              events: ['user.created', 'order.completed'],
            },
          ],
        },
      },
      sso: {
        enabled: false,
        providers: {
          google: {
            enabled: false,
            client_id: 'your_client_id',
          },
          github: {
            enabled: false,
            client_id: 'your_client_id',
          },
        },
      },
    },
  },
  {
    type: 'business-rules',
    name: 'Business Rules',
    description: 'Business logic and rule-based configuration',
    json: {
      rules: {
        order_minimum: {
          enabled: true,
          minimum_amount: 10.0,
          currency: 'USD',
        },
        discount_rules: {
          enabled: true,
          max_discount_percent: 50,
          require_coupon_code: true,
        },
        user_limits: {
          max_orders_per_day: 10,
          max_items_per_order: 50,
        },
      },
      workflows: {
        order_approval: {
          enabled: true,
          threshold_amount: 1000.0,
          require_approval: true,
        },
        auto_refund: {
          enabled: false,
          max_refund_amount: 100.0,
        },
      },
      features: {
        gift_cards: {
          enabled: true,
          min_amount: 5.0,
          max_amount: 500.0,
        },
        subscriptions: {
          enabled: true,
          allow_cancellation: true,
          prorate_refunds: true,
        },
      },
    },
  },
  {
    type: 'environment',
    name: 'Environment Configuration',
    description: 'Environment-specific settings for dev, staging, and production',
    json: {
      environments: {
        development: {
          debug_mode: true,
          log_level: 'debug',
          api_url: 'https://dev-api.example.com',
          enable_test_features: true,
        },
        staging: {
          debug_mode: false,
          log_level: 'info',
          api_url: 'https://staging-api.example.com',
          enable_test_features: true,
        },
        production: {
          debug_mode: false,
          log_level: 'error',
          api_url: 'https://api.example.com',
          enable_test_features: false,
        },
      },
      feature_rollout: {
        new_checkout: {
          dev: 100,
          staging: 50,
          production: 0,
        },
        dark_mode: {
          dev: 100,
          staging: 100,
          production: 25,
        },
      },
    },
  },
];

export function getTemplate(type: TemplateType): Template | undefined {
  return templates.find((t) => t.type === type);
}

