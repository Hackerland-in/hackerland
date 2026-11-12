import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Badge,
  Button,
  FilterChip,
  IconButton,
  Input,
  SearchField,
  StatusDot,
} from '../index';

describe('Button', () => {
  it('renders a primary button by default', () => {
    render(<Button>Start project</Button>);
    const button = screen.getByRole('button', { name: 'Start project' });
    expect(button.className).toContain('bg-accent');
  });

  it('applies the make variant', () => {
    render(<Button variant="make">Submit RFQ</Button>);
    expect(screen.getByRole('button').className).toContain('bg-make');
  });

  it('is disabled and busy while loading', () => {
    render(<Button loading>Saving</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
  });

  it('renders its child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/x">Go</a>
      </Button>,
    );
    const link = screen.getByRole('link', { name: 'Go' });
    expect(link.tagName).toBe('A');
    expect(link.className).toContain('bg-accent');
  });
});

describe('IconButton', () => {
  it('uses its label as the accessible name', () => {
    render(
      <IconButton label="Notifications">
        <svg />
      </IconButton>,
    );
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeInTheDocument();
  });
});

describe('Badge', () => {
  it('uses the track text colour for a track tone', () => {
    render(<Badge tone="research">Deep-tech</Badge>);
    expect(screen.getByText('Deep-tech').className).toContain('text-research-fg');
  });

  it('is neutral by default', () => {
    render(<Badge>Open</Badge>);
    expect(screen.getByText('Open').className).toContain('text-fg-muted');
  });
});

describe('FilterChip', () => {
  it('reports pressed state', () => {
    render(
      <>
        <FilterChip selected>All</FilterChip>
        <FilterChip>Questions</FilterChip>
      </>,
    );
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Questions' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('marks a selected link chip as current', () => {
    render(
      <FilterChip asChild selected>
        <a href="/feed">All</a>
      </FilterChip>,
    );
    const link = screen.getByRole('link', { name: 'All' });
    expect(link).toHaveAttribute('aria-current', 'true');
    expect(link).not.toHaveAttribute('aria-pressed');
  });
});

describe('StatusDot', () => {
  it('exposes its label to screen readers', () => {
    render(<StatusDot label="Live" pulse />);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });
});

describe('Input', () => {
  it('marks itself invalid', () => {
    render(<Input aria-label="Email" invalid />);
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('SearchField', () => {
  it('renders a searchbox', () => {
    render(<SearchField aria-label="Search" />);
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument();
  });
});
