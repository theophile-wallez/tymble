import { useState } from 'react';
import 'react-grid-layout/css/styles.css';
import { mockDashboardData } from '../mock/dashboard.mock';
import { Widget } from '../widgets/widget';
import { DashboardGrid } from './dashboard-grid';

type DashboardProps = {
  isEditing?: boolean;
};

export const Dashboard = ({ isEditing = false }: DashboardProps) => {
  const [layout, setLayout] = useState(
    mockDashboardData.items.map((item) => item.layout)
  );
  // Merge current layout state with constraints from mock data
  // This ensures minW/minH are respected even if state is stale or RGL drops them
  const constrainedLayout = layout.map((l) => {
    const mockItem = mockDashboardData.items.find((item) => item.id === l.i);
    return {
      ...l,
      minW: mockItem?.layout.minW,
      minH: mockItem?.layout.minH,
      maxW: mockItem?.layout.maxW,
      maxH: mockItem?.layout.maxH,
    };
  });

  return (
    <DashboardGrid
      isEditing={isEditing}
      layout={constrainedLayout}
      onLayoutChange={setLayout}
    >
      {mockDashboardData.items.map((item) => (
        <div key={item.id}>
          <Widget isEditing={isEditing} item={item} />
        </div>
      ))}
    </DashboardGrid>
  );
};
