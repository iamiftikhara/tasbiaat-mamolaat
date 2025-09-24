# Loader Components Usage Guide

This guide explains how to use the various loader components in the Al-Burhan Tasbiaat Mamolaat application.

## Overview

The application provides three main types of loaders:

1. **FullPageLoader**: For initial page loading that covers the entire screen
2. **ComponentLoader**: For specific components/widgets while loading API data
3. **SkeletonLoaders**: For showing placeholder content that mimics the actual UI structure

## Installation & Setup

### 1. Import Components

```jsx
// Import specific loaders
import { FullPageLoader, ComponentLoader, CardSkeleton } from '@/components/Loaders';

// Or import all at once
import { 
  FullPageLoader, 
  ComponentLoader, 
  CardSkeleton, 
  WidgetSkeleton,
  ChartSkeleton,
  TableSkeleton,
  ListSkeleton,
  ProgramSkeleton,
  DashboardSkeleton,
  SectionSkeleton,
  LoadingProvider,
  useLoading,
  useApiLoading
} from '@/components/Loaders';
```

### 2. Setup Loading Context (Optional but Recommended)

Wrap your app or specific sections with `LoadingProvider`:

```jsx
// In your layout.js or main component
import { LoadingProvider } from '@/components/Loaders';

export default function Layout({ children }) {
  return (
    <LoadingProvider>
      {children}
    </LoadingProvider>
  );
}
```

## Component Usage

### 1. FullPageLoader

Use for initial page loading or major navigation transitions:

```jsx
import { FullPageLoader } from '@/components/Loaders';

function MyPage() {
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    // Simulate page initialization
    setTimeout(() => setPageLoading(false), 2000);
  }, []);

  if (pageLoading) {
    return <FullPageLoader message="جاري تحميل الصفحة..." variant="branded" />;
  }

  return <div>Your page content</div>;
}
```

**Props:**
- `message`: Loading message (default: "جاري التحميل...")
- `showMessage`: Show/hide message (default: true)
- `variant`: "default" | "minimal" | "branded"

### 2. ComponentLoader

Use for loading states on specific components:

```jsx
import { ComponentLoader } from '@/components/Loaders';

function DataWidget() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.getData();
      setData(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ComponentLoader 
      loading={loading} 
      message="جاري تحميل البيانات..."
      variant="spinner"
      overlay={true}
    >
      <Card title="Data Widget">
        {data ? (
          <div>{/* Your data content */}</div>
        ) : (
          <Button onClick={fetchData}>Load Data</Button>
        )}
      </Card>
    </ComponentLoader>
  );
}
```

**Props:**
- `loading`: Boolean loading state
- `children`: Content to wrap
- `message`: Loading message
- `showMessage`: Show/hide message
- `overlay`: Show as overlay (true) or replace content (false)
- `size`: "small" | "default" | "large"
- `variant`: "spinner" | "dots" | "pulse"

### 3. Skeleton Loaders

Use for showing placeholder content while data loads:

#### Card Skeleton
```jsx
import { CardSkeleton } from '@/components/Loaders';

function ArticleCard({ article, loading }) {
  if (loading) {
    return <CardSkeleton showHeader={true} showFooter={true} />;
  }

  return (
    <Card title={article.title} extra={<Button>Read More</Button>}>
      <p>{article.content}</p>
    </Card>
  );
}
```

#### Widget Skeleton
```jsx
import { WidgetSkeleton } from '@/components/Loaders';

function StatWidget({ stat, loading }) {
  if (loading) {
    return <WidgetSkeleton />;
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <Text type="secondary">{stat.label}</Text>
          <div className="text-2xl font-bold">{stat.value}</div>
        </div>
        <div className="text-3xl">{stat.icon}</div>
      </div>
    </Card>
  );
}
```

#### Chart Skeleton
```jsx
import { ChartSkeleton } from '@/components/Loaders';

function ChartComponent({ data, loading, type = "bar" }) {
  if (loading) {
    return <ChartSkeleton type={type} />;
  }

  return (
    <Card title="Chart">
      {/* Your actual chart component */}
    </Card>
  );
}
```

#### Table Skeleton
```jsx
import { TableSkeleton } from '@/components/Loaders';

function DataTable({ data, loading }) {
  if (loading) {
    return <TableSkeleton rows={5} columns={4} />;
  }

  return (
    <Table 
      dataSource={data} 
      columns={columns}
      pagination={{ pageSize: 10 }}
    />
  );
}
```

#### Section Skeleton (Your Example)
```jsx
import { SectionSkeleton } from '@/components/Loaders';

function ProgramsSection({ programs, loading, isMobile }) {
  if (loading) {
    return (
      <SectionSkeleton 
        title={true} 
        items={4} 
        isMobile={isMobile} 
      />
    );
  }

  return (
    <section className="py-16" style={{ backgroundColor: theme.colors.background.primary }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <Title level={2}>Our Programs</Title>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>
        <div className={isMobile 
          ? "flex overflow-x-auto gap-6 pb-4 scrollbar-hide" 
          : "grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        }>
          {programs.map((program, index) => (
            <div key={index} className={isMobile ? 'min-w-[280px] flex-shrink-0' : ''}>
              <ProgramCard program={program} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

## Loading Context & Hooks

### useLoading Hook

For managing multiple loading states:

```jsx
import { useLoading } from '@/components/Loaders';

function MyComponent() {
  const { setLoading, getLoading } = useLoading();
  
  const handleOperation = async () => {
    setLoading('operation1', true, 'Processing...');
    try {
      await someAsyncOperation();
    } finally {
      setLoading('operation1', false);
    }
  };

  const operation1Loading = getLoading('operation1');

  return (
    <div>
      <Button 
        onClick={handleOperation} 
        loading={operation1Loading.loading}
      >
        {operation1Loading.loading ? operation1Loading.message : 'Start Operation'}
      </Button>
    </div>
  );
}
```

### useApiLoading Hook

For automatic API loading management:

```jsx
import { useApiLoading } from '@/components/Loaders';

function ApiComponent() {
  const { loading, executeWithLoading } = useApiLoading('api-call');
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const result = await executeWithLoading(
        () => api.fetchData(),
        'جاري تحميل البيانات من الخادم...'
      );
      setData(result);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  return (
    <ComponentLoader loading={loading}>
      <Card title="API Data">
        {data ? (
          <div>{JSON.stringify(data)}</div>
        ) : (
          <Button onClick={fetchData}>Load Data</Button>
        )}
      </Card>
    </ComponentLoader>
  );
}
```

## Advanced Usage Patterns

### 1. Conditional Loading with Multiple States

```jsx
function ComplexComponent() {
  const [initialLoading, setInitialLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState(null);

  // Initial page load
  if (initialLoading) {
    return <FullPageLoader variant="branded" />;
  }

  return (
    <div>
      <ComponentLoader loading={dataLoading} overlay={true}>
        <Card title="Data Display">
          {data ? (
            <div>{/* Render data */}</div>
          ) : (
            <CardSkeleton />
          )}
        </Card>
      </ComponentLoader>
    </div>
  );
}
```

### 2. Progressive Loading

```jsx
function ProgressiveLoadingPage() {
  const [pageLoaded, setPageLoaded] = useState(false);
  const [sectionsLoaded, setSectionsLoaded] = useState({
    header: false,
    stats: false,
    charts: false,
    table: false
  });

  return (
    <div>
      {/* Header Section */}
      {sectionsLoaded.header ? (
        <PageHeader />
      ) : (
        <div className="animate-pulse">
          <div className="h-16 bg-gray-200 rounded mb-4"></div>
        </div>
      )}

      {/* Stats Section */}
      <Row gutter={[16, 16]}>
        {[...Array(4)].map((_, i) => (
          <Col key={i} xs={24} sm={12} lg={6}>
            {sectionsLoaded.stats ? (
              <StatWidget />
            ) : (
              <WidgetSkeleton />
            )}
          </Col>
        ))}
      </Row>

      {/* Charts Section */}
      {sectionsLoaded.charts ? (
        <ChartsSection />
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <ChartSkeleton type="bar" />
          </Col>
          <Col xs={24} lg={12}>
            <ChartSkeleton type="pie" />
          </Col>
        </Row>
      )}
    </div>
  );
}
```

### 3. Error States with Loaders

```jsx
function DataComponentWithError() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.fetchData();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <CardSkeleton />;
  }

  if (error) {
    return (
      <Card>
        <Result
          status="error"
          title="Failed to load data"
          subTitle={error}
          extra={<Button onClick={fetchData}>Retry</Button>}
        />
      </Card>
    );
  }

  return (
    <Card title="Data">
      {data ? (
        <div>{/* Render data */}</div>
      ) : (
        <Button onClick={fetchData}>Load Data</Button>
      )}
    </Card>
  );
}
```

## Best Practices

### 1. Choose the Right Loader Type

- **FullPageLoader**: Initial app/page loading, major navigation
- **ComponentLoader**: API calls, form submissions, specific widget updates
- **SkeletonLoaders**: Content that will be replaced with actual data

### 2. Consistent Loading Messages

```jsx
// Create constants for consistent messages
const LOADING_MESSAGES = {
  PAGE: 'جاري تحميل الصفحة...',
  DATA: 'جاري تحميل البيانات...',
  SAVING: 'جاري الحفظ...',
  PROCESSING: 'جاري المعالجة...'
};
```

### 3. Loading State Management

```jsx
// Use loading context for complex components
const MyComplexComponent = () => {
  const { setLoading, getLoading } = useLoading();
  
  // Better than managing multiple useState for loading
  const handleMultipleOperations = async () => {
    setLoading('op1', true);
    setLoading('op2', true);
    
    try {
      await Promise.all([operation1(), operation2()]);
    } finally {
      setLoading('op1', false);
      setLoading('op2', false);
    }
  };
};
```

### 4. Accessibility

```jsx
// Add proper ARIA labels
<ComponentLoader 
  loading={loading}
  aria-label="Loading content"
  role="status"
>
  {/* Content */}
</ComponentLoader>
```

### 5. Performance

```jsx
// Debounce rapid loading state changes
const [debouncedLoading] = useDebounce(loading, 300);

return (
  <ComponentLoader loading={debouncedLoading}>
    {/* Content */}
  </ComponentLoader>
);
```

## Demo Page

Visit `/demo/loaders` to see all loader components in action and test their functionality.

## Troubleshooting

### Common Issues

1. **Loader not showing**: Check if loading state is properly set to `true`
2. **Skeleton doesn't match content**: Adjust skeleton structure to match your actual content
3. **Loading context not working**: Ensure component is wrapped with `LoadingProvider`
4. **Performance issues**: Use debouncing for rapid state changes

### Debug Tips

```jsx
// Add debug logging
const { loading } = useLoading('my-component');
console.log('Loading state:', loading);

// Check loading context
const { loadingStates } = useLoading();
console.log('All loading states:', loadingStates);
```