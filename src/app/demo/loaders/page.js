'use client';

import React, { useState } from 'react';
import { Button, Card, Space, Typography, Row, Col, Switch } from 'antd';
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
} from '../../../components/Loaders';

const { Title, Text } = Typography;

// Demo component using loading context
const ApiDemoComponent = () => {
  const { loading, executeWithLoading } = useApiLoading('api-demo');
  
  const simulateApiCall = () => {
    return new Promise(resolve => {
      setTimeout(() => resolve('Data loaded successfully!'), 2000);
    });
  };

  const handleApiCall = async () => {
    try {
      const result = await executeWithLoading(simulateApiCall, 'جاري تحميل البيانات من الخادم...');
      console.log(result);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return (
    <ComponentLoader loading={loading} message="جاري تحميل البيانات من الخادم...">
      <Card title="API Demo Component" className="h-48">
        <Space direction="vertical" className="w-full">
          <Text>This component demonstrates API loading with context.</Text>
          <Button type="primary" onClick={handleApiCall} loading={loading}>
            Simulate API Call
          </Button>
          {!loading && (
            <Text type="success">Component ready! Click the button to test loading.</Text>
          )}
        </Space>
      </Card>
    </ComponentLoader>
  );
};

const LoaderDemoPage = () => {
  const [showFullPageLoader, setShowFullPageLoader] = useState(false);
  const [componentLoading, setComponentLoading] = useState(false);
  const [skeletonLoading, setSkeletonLoading] = useState(true);
  const { setGlobalLoading } = useLoading();

  const toggleFullPageLoader = () => {
    setShowFullPageLoader(true);
    setTimeout(() => setShowFullPageLoader(false), 3000);
  };

  const toggleComponentLoader = () => {
    setComponentLoading(true);
    setTimeout(() => setComponentLoading(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Title level={1}>Loader Components Demo</Title>
          <Text type="secondary">
            This page demonstrates all the different types of loaders available in the application.
          </Text>
        </div>

        {/* Full Page Loader Demo */}
        <Card title="Full Page Loader" className="mb-6">
          <Space>
            <Button type="primary" onClick={toggleFullPageLoader}>
              Show Default Full Page Loader (3s)
            </Button>
            <Button onClick={() => {
              setShowFullPageLoader(true);
              setTimeout(() => setShowFullPageLoader(false), 3000);
            }}>
              Show Branded Loader (3s)
            </Button>
          </Space>
        </Card>

        {/* Component Loader Demo */}
        <Card title="Component Loader" className="mb-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <Button type="primary" onClick={toggleComponentLoader} className="mb-4">
                Toggle Component Loader (2s)
              </Button>
              <ComponentLoader 
                loading={componentLoading} 
                message="جاري تحميل المحتوى..."
                variant="spinner"
              >
                <Card title="Sample Widget" className="h-48">
                  <p>This content will be overlaid with a loader when loading is true.</p>
                  <p>The loader appears on top of this content with a semi-transparent background.</p>
                </Card>
              </ComponentLoader>
            </Col>
            <Col xs={24} md={12}>
              <ApiDemoComponent />
            </Col>
          </Row>
        </Card>

        {/* Skeleton Loaders Demo */}
        <Card title="Skeleton Loaders" className="mb-6">
          <div className="mb-4">
            <Space>
              <Text>Show Skeletons:</Text>
              <Switch 
                checked={skeletonLoading} 
                onChange={setSkeletonLoading}
                checkedChildren="Loading"
                unCheckedChildren="Loaded"
              />
            </Space>
          </div>

          <Row gutter={[16, 16]}>
            {/* Card Skeleton */}
            <Col xs={24} md={8}>
              <Title level={4}>Card Skeleton</Title>
              {skeletonLoading ? (
                <CardSkeleton showHeader={true} showFooter={true} />
              ) : (
                <Card title="Actual Card" extra={<Button>Action</Button>}>
                  <p>This is the actual content that would appear after loading.</p>
                  <p>The skeleton mimics the structure of this content.</p>
                </Card>
              )}
            </Col>

            {/* Widget Skeleton */}
            <Col xs={24} md={8}>
              <Title level={4}>Widget Skeleton</Title>
              {skeletonLoading ? (
                <WidgetSkeleton />
              ) : (
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <Text type="secondary">Total Users</Text>
                      <div className="text-2xl font-bold">1,234</div>
                    </div>
                    <div className="text-3xl text-blue-600">👥</div>
                  </div>
                </Card>
              )}
            </Col>

            {/* Program Skeleton */}
            <Col xs={24} md={8}>
              <Title level={4}>Program Skeleton</Title>
              {skeletonLoading ? (
                <ProgramSkeleton />
              ) : (
                <Card 
                  title="Actual Program"
                  cover={<div className="h-32 bg-blue-100 flex items-center justify-center">Image</div>}
                  actions={[
                    <Button key="view">View</Button>,
                    <Button key="edit" type="primary">Edit</Button>
                  ]}
                >
                  <p>This is an actual program card with real content.</p>
                </Card>
              )}
            </Col>

            {/* Chart Skeletons */}
            <Col xs={24} md={12}>
              <Title level={4}>Chart Skeletons</Title>
              <Space direction="vertical" className="w-full">
                {skeletonLoading ? (
                  <>
                    <ChartSkeleton type="bar" />
                    <ChartSkeleton type="pie" />
                  </>
                ) : (
                  <>
                    <Card title="Bar Chart">
                      <div className="h-48 bg-gradient-to-r from-blue-100 to-blue-200 rounded flex items-center justify-center">
                        Actual Bar Chart Would Be Here
                      </div>
                    </Card>
                    <Card title="Pie Chart">
                      <div className="h-48 bg-gradient-to-r from-green-100 to-green-200 rounded flex items-center justify-center">
                        Actual Pie Chart Would Be Here
                      </div>
                    </Card>
                  </>
                )}
              </Space>
            </Col>

            {/* Table and List Skeletons */}
            <Col xs={24} md={12}>
              <Title level={4}>Table & List Skeletons</Title>
              <Space direction="vertical" className="w-full">
                {skeletonLoading ? (
                  <>
                    <TableSkeleton rows={3} columns={3} />
                    <ListSkeleton items={3} showAvatar={true} />
                  </>
                ) : (
                  <>
                    <Card title="Actual Table">
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 bg-gray-50 rounded">
                          <span>Name</span>
                          <span>Role</span>
                          <span>Status</span>
                        </div>
                        <div className="flex justify-between p-2">
                          <span>Ahmed Ali</span>
                          <span>Admin</span>
                          <span>Active</span>
                        </div>
                      </div>
                    </Card>
                    <Card title="Actual List">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3 p-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                          <div>
                            <div className="font-medium">User Name</div>
                            <div className="text-sm text-gray-500">user@example.com</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </>
                )}
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Section Skeleton Demo */}
        <Card title="Section Skeleton (Full Width)" className="mb-6">
          {skeletonLoading ? (
            <SectionSkeleton title={true} items={4} isMobile={false} />
          ) : (
            <div className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                  <Title level={2}>Actual Section Title</Title>
                  <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
                </div>
                <Row gutter={[24, 24]}>
                  {[...Array(4)].map((_, i) => (
                    <Col key={i} xs={24} sm={12} lg={6}>
                      <Card title={`Item ${i + 1}`}>
                        <p>Actual content for item {i + 1}</p>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            </div>
          )}
        </Card>

        {/* Dashboard Skeleton Demo */}
        <Card title="Dashboard Skeleton (Complete Layout)">
          {skeletonLoading ? (
            <DashboardSkeleton />
          ) : (
            <div className="space-y-6">
              <div>
                <Title level={2}>Actual Dashboard</Title>
                <Text type="secondary">This would be your real dashboard content</Text>
              </div>
              <Row gutter={[16, 16]}>
                {[...Array(4)].map((_, i) => (
                  <Col key={i} xs={24} sm={12} lg={6}>
                    <Card>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{(i + 1) * 123}</div>
                        <div className="text-gray-500">Metric {i + 1}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Card>
      </div>

      {/* Full Page Loader */}
      {showFullPageLoader && (
        <FullPageLoader 
          variant="branded" 
          message="جاري تحميل التطبيق..."
        />
      )}
    </div>
  );
};

// Wrap with LoadingProvider
const LoaderDemoPageWithProvider = () => (
  <LoadingProvider>
    <LoaderDemoPage />
  </LoadingProvider>
);

export default LoaderDemoPageWithProvider;