import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from '@dnd-kit/sortable';
import { Check, Pencil } from 'lucide-react';
import { useState } from 'react';
import {
  ContentBody,
  ContentHeader,
  ContentLayout,
  ContentSubHeader,
  ContentTitle,
} from '@/layouts/content.layout';
import { Badge } from '@/ui/badge';
import { Button } from '@/ui/button';
import { Dashboard } from './dashboard/dashboard';
import {
  type DashboardTab,
  SortableDashboardTabItem,
} from './dashboard-tab-item';

// Mock dashboard data
const initialDashboards: DashboardTab[] = [
  { id: '1', name: 'Overview', emoji: '📊' },
  { id: '2', name: 'Sales Analytics', emoji: '💰' },
  { id: '3', name: 'Marketing', emoji: '📣' },
  { id: '4', name: 'Operations', emoji: '⚙️' },
];

export const Dashboards = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [activeDashboard, setActiveDashboard] = useState(dashboards[0].id);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setDashboards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <ContentLayout cy="dashboards">
      <ContentHeader cy="dashboards">
        <ContentTitle cy="dashboards">
          Dashboards <Badge variant="secondary">{dashboards.length}</Badge>
        </ContentTitle>
      </ContentHeader>
      <ContentSubHeader className="justify-between gap-4" cy="dashboards">
        <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
          >
            <SortableContext
              items={dashboards}
              strategy={horizontalListSortingStrategy}
            >
              {dashboards.map((dashboard) => (
                <SortableDashboardTabItem
                  dashboard={dashboard}
                  isActive={activeDashboard === dashboard.id}
                  key={dashboard.id}
                  onClick={() => setActiveDashboard(dashboard.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <Button
          className="shrink-0"
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
          variant={isEditing ? 'default' : 'outline'}
        >
          {isEditing ? (
            <>
              <Check className="mr-1 size-4" />
              Save
            </>
          ) : (
            <>
              <Pencil className="mr-1 size-4" />
              Edit
            </>
          )}
        </Button>
      </ContentSubHeader>
      <ContentBody>
        <Dashboard isEditing={isEditing} />
      </ContentBody>
    </ContentLayout>
  );
};
