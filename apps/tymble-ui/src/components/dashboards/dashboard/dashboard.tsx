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

  return (
    <DashboardGrid
      isEditing={isEditing}
      layout={layout}
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
