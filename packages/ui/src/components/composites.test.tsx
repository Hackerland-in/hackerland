import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import {
  Avatar,
  AvatarGroup,
  EmptyState,
  Panel,
  ProgressBar,
  SegmentedProgress,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../index';

describe('ProgressBar', () => {
  it('clamps values above max', () => {
    render(<ProgressBar label="Funding" value={150} />);
    expect(screen.getByRole('progressbar', { name: 'Funding' })).toHaveAttribute(
      'aria-valuenow',
      '100',
    );
  });

  it('clamps negative values to zero', () => {
    render(<ProgressBar label="Funding" value={-5} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
  });
});

describe('SegmentedProgress', () => {
  it('renders one segment per step and fills the completed ones', () => {
    const { container } = render(
      <SegmentedProgress label="Milestones" total={7} completed={3} />,
    );
    expect(container.querySelectorAll('[data-segment]')).toHaveLength(7);
    expect(container.querySelectorAll('[data-filled="true"]')).toHaveLength(3);
  });
});

describe('Avatar', () => {
  it('shows initials without an image, ignoring honorifics', () => {
    render(<Avatar name="Dr. Meera Iyer" />);
    expect(screen.getByText('MI')).toBeInTheDocument();
  });

  it('renders the image with the person as alt text', () => {
    render(<Avatar name="Dr. Meera Iyer" src="/meera.png" />);
    expect(screen.getByRole('img', { name: 'Dr. Meera Iyer' }).tagName).toBe('IMG');
  });
});

describe('AvatarGroup', () => {
  it('shows an overflow count beyond max', () => {
    const people = ['A One', 'B Two', 'C Three', 'D Four', 'E Five', 'F Six'].map((name) => ({
      name,
    }));
    render(<AvatarGroup people={people} max={4} />);
    expect(screen.getAllByRole('img')).toHaveLength(4);
    expect(screen.getByLabelText('2 more')).toHaveTextContent('+2');
  });
});

function DemoTabs() {
  return (
    <Tabs defaultValue="projects">
      <TabsList label="Profile sections">
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="endorsements">Endorsements</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
      </TabsList>
      <TabsContent value="projects">Projects panel</TabsContent>
      <TabsContent value="endorsements">Endorsements panel</TabsContent>
      <TabsContent value="skills">Skills panel</TabsContent>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('shows the selected panel only', async () => {
    const user = userEvent.setup();
    render(<DemoTabs />);
    expect(screen.getByText('Projects panel')).toBeVisible();
    await user.click(screen.getByRole('tab', { name: 'Endorsements' }));
    expect(screen.getByText('Endorsements panel')).toBeVisible();
    expect(screen.queryByText('Projects panel')).not.toBeInTheDocument();
  });

  it('moves focus and selection with arrow, Home and End keys', async () => {
    const user = userEvent.setup();
    render(<DemoTabs />);
    const [projects, endorsements, skills] = screen.getAllByRole('tab');

    projects!.focus();
    await user.keyboard('{ArrowRight}');
    expect(endorsements).toHaveFocus();
    expect(endorsements).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{End}');
    expect(skills).toHaveFocus();

    await user.keyboard('{ArrowRight}');
    expect(projects).toHaveFocus();
    expect(projects).toHaveAttribute('aria-selected', 'true');

    await user.keyboard('{Home}');
    expect(projects).toHaveFocus();
  });

  it('links each tab to its panel', () => {
    render(<DemoTabs />);
    const tab = screen.getByRole('tab', { name: 'Projects' });
    const panel = screen.getByRole('tabpanel');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
  });
});

describe('Panel', () => {
  it('is a region named by its title', () => {
    render(<Panel title="Open roles">content</Panel>);
    expect(screen.getByRole('region', { name: 'Open roles' })).toBeInTheDocument();
  });
});

describe('EmptyState', () => {
  it('renders its title as a heading', () => {
    render(<EmptyState title="Nothing here yet" />);
    expect(screen.getByRole('heading', { name: 'Nothing here yet' })).toBeInTheDocument();
  });
});
