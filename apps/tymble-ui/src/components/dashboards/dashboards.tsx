import { Pencil } from 'lucide-react';
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

export const Dashboards = () => {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <ContentLayout cy="dashboards">
      <ContentHeader cy="dashboards">
        <ContentTitle cy="dashboards">
          Dashboards <Badge variant="secondary">4</Badge>
        </ContentTitle>
      </ContentHeader>
      <ContentSubHeader className="justify-between" cy="dashboards">
        <ContentTitle cy="dashboards">Dashboards</ContentTitle>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          size="sm"
          variant={isEditing ? 'default' : 'outline'}
        >
          <Pencil className="mr-1 size-4" />
          {isEditing ? 'Editing' : 'Edit'}
        </Button>
      </ContentSubHeader>
      <ContentBody>
        <Dashboard isEditing={isEditing} />
      </ContentBody>
    </ContentLayout>
  );
};
