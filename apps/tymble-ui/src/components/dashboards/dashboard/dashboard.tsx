import GridLayout from 'react-grid-layout';

const layout = [];

export const Dashboard = () => (
  <GridLayout
    className="layout"
    cols={12}
    layout={layout}
    rowHeight={30}
    width={1200}
  ></GridLayout>
);
