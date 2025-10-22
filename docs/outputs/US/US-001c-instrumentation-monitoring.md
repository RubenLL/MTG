# US-001c: Instrumentation & Monitoring Setup

## Objetivo
Configurar instrumentación completa del sistema usando herramientas FOSS para monitoreo, analytics y observabilidad.

## Descripción Funcional
Como DevOps engineer, necesito implementar un sistema completo de monitoreo y observabilidad usando herramientas open source que proporcione visibilidad total del comportamiento del sistema, performance y errores.

## Stack de Instrumentación FOSS

### **1. Analytics & User Behavior**
**PostHog (Self-hosted)**
```yaml
# docker-compose.yml
posthog:
  image: posthog/posthog:latest
  environment:
    SECRET_KEY: your-secret-key
    DATABASE_URL: postgres://posthog:password@posthog-db:5432/posthog
    REDIS_URL: redis://posthog-redis:6379
    SITE_URL: https://analytics.your-domain.com
  ports:
    - "8000:8000"
  depends_on:
    - posthog-db
    - posthog-redis

posthog-db:
  image: postgres:13
  environment:
    POSTGRES_DB: posthog
    POSTGRES_USER: posthog
    POSTGRES_PASSWORD: secure_password

posthog-redis:
  image: redis:6-alpine
```

**Configuración Flutter:**
```dart
// Flutter - PostHog setup
class AnalyticsService {
  static Future<void> initialize() async {
    await Posthog().setup('your-project-api-key', {
      'host': 'https://analytics.your-domain.com',
      'debug': kDebugMode,
      'request_timeout': 10,
      'max_cache_size': 1000,
    });

    // Set up automatic tracking
    _setupAutomaticTracking();
  }

  static void trackEvent(String eventName, {Map<String, dynamic>? properties}) {
    Posthog().capture(eventName, properties);
  }

  static void trackScreen(String screenName) {
    Posthog().screen(screenName);
  }

  static void identifyUser(String userId, {Map<String, dynamic>? traits}) {
    Posthog().identify(userId, traits);
  }
}
```

### **2. Error Tracking & Monitoring**
**Sentry (Self-hosted)**
```yaml
# docker-compose.yml
sentry:
  image: getsentry/sentry:latest
  environment:
    SENTRY_SECRET_KEY: your-sentry-secret-key
    SENTRY_DB_USER: sentry
    SENTRY_DB_PASSWORD: secure_password
    SENTRY_POSTGRES_HOST: sentry-db
    SENTRY_REDIS_HOST: sentry-redis
  ports:
    - "9000:9000"
  depends_on:
    - sentry-db
    - sentry-redis

sentry-db:
  image: postgres:13
  environment:
    POSTGRES_DB: sentry
    POSTGRES_USER: sentry
    POSTGRES_PASSWORD: secure_password

sentry-redis:
  image: redis:6-alpine
```

**Flutter Integration:**
```dart
// Flutter - Sentry error tracking
class ErrorTrackingService {
  static Future<void> initialize() async {
    await SentryFlutter.init(
      (options) {
        options.dsn = 'https://your-dsn@sentry.your-domain.com/project-id';
        options.tracesSampleRate = 1.0;
        options.attachScreenshot = true;
        options.environment = kDebugMode ? 'development' : 'production';
        options.beforeSend = _beforeSendCallback;
      },
      appRunner: () => runApp(MyApp()),
    );

    // Set up global error handlers
    _setupGlobalErrorHandlers();
  }

  static void captureException(dynamic exception, StackTrace stackTrace, {Map<String, dynamic>? context}) {
    Sentry.captureException(
      exception,
      stackTrace: stackTrace,
      withScope: (scope) {
        scope.setTag('component', 'deck_validator');
        if (context != null) {
          scope.setContexts('user_context', context);
        }
      },
    );
  }

  static SentryEvent? _beforeSendCallback(SentryEvent event, {dynamic hint}) {
    // Filter sensitive data
    if (event.message?.contains('password') == true) {
      return null;
    }
    return event;
  }
}
```

### **3. Performance Monitoring**
**Web Vitals + Custom Metrics**
```dart
// Flutter - Performance monitoring
class PerformanceMonitor {
  static void initialize() {
    // Core Web Vitals (web only)
    if (kIsWeb) {
      _setupWebVitals();
    }

    // Custom performance traces
    _setupCustomTraces();
  }

  static void _setupWebVitals() {
    // Use web-vitals library or implement custom
    html.window.onLoad.listen((_) {
      _measureAndReportWebVitals();
    });
  }

  static Future<void> _measureAndReportWebVitals() async {
    // Largest Contentful Paint
    final lcp = await _measureLCP();

    // First Input Delay
    final fid = await _measureFID();

    // Cumulative Layout Shift
    final cls = await _measureCLS();

    // Report to analytics
    Posthog().capture('web_vitals', {
      'lcp': lcp,
      'fid': fid,
      'cls': cls,
      'timestamp': DateTime.now().toIso8601String(),
    });
  }

  static void startTrace(String name) {
    // Custom performance trace
    final trace = FirebasePerformance.instance.newTrace(name);
    trace.start();
    _activeTraces[name] = trace;
  }

  static Future<void> stopTrace(String name) async {
    final trace = _activeTraces[name];
    if (trace != null) {
      await trace.stop();
      _activeTraces.remove(name);
    }
  }
}
```

### **4. Logging & Infrastructure Monitoring**
**ELK Stack Configuration**
```yaml
# docker-compose.yml - ELK Stack
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.17.6
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
      - xpack.security.enabled=false
      - xpack.monitoring.enabled=false
    ports:
      - "9200:9200"
    volumes:
      - elasticsearch-data:/usr/share/elasticsearch/data

  logstash:
    image: docker.elastic.co/logstash/logstash:7.17.6
    environment:
      - "LS_JAVA_OPTS=-Xms256m -Xmx256m"
    ports:
      - "5044:5044"
    volumes:
      - ./logstash/config:/usr/share/logstash/config:ro
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.17.6
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch

volumes:
  elasticsearch-data:
```

**Logstash Configuration:**
```ruby
# logstash.conf
input {
  http {
    port => 5044
    codec => json
  }
  tcp {
    port => 5045
    codec => json
  }
}

filter {
  # Parse Flutter logs
  if [component] == "frontend" {
    mutate {
      add_field => {
        "log_type" => "frontend"
        "platform" => "flutter"
      }
    }
  }

  # Parse backend logs
  if [service] == "deck-validator" {
    mutate {
      add_field => {
        "log_type" => "backend"
        "platform" => "typescript"
      }
    }
  }

  # Add timestamp if missing
  if ![@timestamp] {
    mutate {
      add_field => {
        "@timestamp" => "%{@timestamp}"
      }
    }
  }
}

output {
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "mtg-logs-%{+YYYY.MM.dd}"
  }
}
```

### **5. Infrastructure Monitoring**
**Grafana + Prometheus**
```yaml
# docker-compose.yml - Monitoring stack
grafana:
  image: grafana/grafana:latest
  environment:
    - GF_SECURITY_ADMIN_PASSWORD=secure_password
  ports:
    - "3000:3000"
  volumes:
    - grafana-data:/var/lib/grafana

prometheus:
  image: prom/prometheus:latest
  ports:
    - "9090:9090"
  volumes:
    - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
  command:
    - '--config.file=/etc/prometheus/prometheus.yml'
    - '--web.console.libraries=/etc/prometheus/console_libraries'
    - '--web.console.templates=/etc/prometheus/consoles'

alertmanager:
  image: prom/alertmanager:latest
  ports:
    - "9093:9093"
  volumes:
    - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro
```

**Prometheus Configuration:**
```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'deck-validator-api'
    static_configs:
      - targets: ['api:3000']
    metrics_path: '/metrics'

  - job_name: 'frontend-metrics'
    static_configs:
      - targets: ['frontend:3001']
    metrics_path: '/metrics'
```

### **6. Health Checks & Alerting**
```typescript
// TypeScript - Health check endpoints
export class HealthController {
  @Get('/health')
  async healthCheck(): Promise<HealthResponse> {
    const checks = await Promise.all([
      this.checkDatabase(),
      this.checkExternalApis(),
      this.checkCache(),
      this.checkDiskSpace(),
    ]);

    const isHealthy = checks.every(check => check.status === 'healthy');

    return {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
      uptime: process.uptime(),
      version: process.env.APP_VERSION || '1.0.0',
    };
  }

  @Get('/metrics')
  async metrics(): Promise<string> {
    // Prometheus metrics format
    return `
# HELP deck_validation_requests_total Total validation requests
# TYPE deck_validation_requests_total counter
deck_validation_requests_total{format="modern"} ${this.metrics.modernCount}
deck_validation_requests_total{format="standard"} ${this.metrics.standardCount}

# HELP deck_validation_errors_total Total validation errors
# TYPE deck_validation_errors_total counter
deck_validation_errors_total{error_type="validation"} ${this.metrics.validationErrors}
deck_validation_errors_total{error_type="system"} ${this.metrics.systemErrors}
    `;
  }
}
```

**Alerting Rules:**
```yaml
# alertmanager.yml
route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'email-notifications'

receivers:
  - name: 'email-notifications'
    email_configs:
      - to: 'devops@your-domain.com'
        from: 'alerts@your-domain.com'
        smarthost: 'smtp.your-domain.com:587'
        auth_username: 'alerts'
        auth_password: 'secure_password'

inhibit_rules:
  - source_match:
      severity: 'critical'
    target_match:
      severity: 'warning'
    equal: ['alertname']
```

## Criterios de Aceptación

### **Analytics & User Behavior**
- [ ] PostHog captura eventos de usuario correctamente
- [ ] User journey tracking funcional
- [ ] Funnel analysis disponible
- [ ] Real-time dashboards operativos

### **Error Tracking**
- [ ] Sentry captura errores de frontend y backend
- [ ] Error categorization automática
- [ ] Stack traces y context completos
- [ ] Screenshot capture para errores UI

### **Performance Monitoring**
- [ ] Web Vitals tracking funcional
- [ ] Custom performance traces
- [ ] API response time monitoring
- [ ] Resource usage tracking

### **Logging & Infrastructure**
- [ ] ELK Stack ingesta logs de frontend y backend
- [ ] Log parsing y categorization
- [ ] Kibana dashboards configurados
- [ ] Log retention policies implementadas

### **Health Monitoring**
- [ ] Health check endpoints responden correctamente
- [ ] Prometheus metrics collection
- [ ] Grafana dashboards con métricas relevantes
- [ ] Alerting system funcional

## Testing & Validation

### **Monitoring Tests**
- [ ] Analytics events se capturan correctamente
- [ ] Error tracking funciona en escenarios de error
- [ ] Performance metrics se reportan apropiadamente
- [ ] Health checks detectan problemas reales

### **Infrastructure Tests**
- [ ] Docker containers se inician correctamente
- [ ] Services discover entre sí apropiadamente
- [ ] Data persistence funciona
- [ ] Backup y recovery procedures

### **Security & Privacy**
- [ ] No sensitive data en logs de analytics
- [ ] GDPR compliance en data collection
- [ ] User consent management
- [ ] Data encryption en tránsito y reposo
