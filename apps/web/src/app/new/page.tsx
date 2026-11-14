import { NewProjectWizard } from '@/components/new-project/wizard';

export const metadata = {
  title: 'Start a project | Hackerland',
  description: 'Assemble a squad, launch a project, and build in public.',
};

export default function NewProjectPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 text-center">
        <h1 className="font-display text-headline-xl text-fg">Start a project</h1>
        <p className="mt-2 text-body-md text-fg-muted">
          Form a cross-disciplinary squad and take your idea from concept to launch
        </p>
      </div>

      <NewProjectWizard />
    </div>
  );
}
