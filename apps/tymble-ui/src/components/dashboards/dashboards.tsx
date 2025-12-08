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
import { AnimatePresence, motion } from 'motion/react';
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
          asChild
          className="shrink-0 overflow-hidden transition-colors"
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
          variant={isEditing ? 'default' : 'outline'}
        >
          <motion.button layout>
            <AnimatePresence initial={false} mode="popLayout">
              {isEditing ? (
                <motion.div
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className="flex items-center"
                  exit={{ opacity: 0, y: 0, filter: 'blur(4px)' }}
                  initial={{ opacity: 0, y: 0, filter: 'blur(4px)' }}
                  key="save"
                  transition={{
                    bounce: 0,
                    duration: 0.2,
                    type: 'spring',
                  }}
                >
                  <Check className="mr-2 size-4" />
                  Save dashboard
                </motion.div>
              ) : (
                <motion.div
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  className="flex items-center"
                  exit={{ opacity: 0, y: 0, filter: 'blur(4px)' }}
                  initial={{ opacity: 0, y: 0, filter: 'blur(4px)' }}
                  key="edit"
                  transition={{
                    bounce: 0,
                    duration: 0.2,
                    type: 'spring',
                  }}
                >
                  <Pencil className="mr-2 size-4" />
                  Edit dashboard
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </Button>
      </ContentSubHeader>
      <ContentBody cy="dashboard">
        <Dashboard isEditing={isEditing} />
      </ContentBody>
    </ContentLayout>
  );
};
