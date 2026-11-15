'use client';

import { useState } from 'react';
import { Button, Input } from '@hackerland/ui';

export interface RegisterLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const COMMON_TOOLS = [
  '3D Printers',
  'Oscilloscopes',
  'SMT Soldering',
  'Laser Cutters',
  'CNC Milling',
  'WebSerial HIL Rig',
];

export function RegisterLabModal({
  isOpen,
  onClose,
  onSuccess,
}: RegisterLabModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'atl' | 'fablab' | 'college' | 'incubator'>('atl');
  const [institution, setInstitution] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [selectedTools, setSelectedTools] = useState<string[]>(['3D Printers', 'SMT Soldering']);
  const [contactName, setContactName] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleTool = (tool: string) => {
    setSelectedTools((prev) =>
      prev.includes(tool) ? prev.filter((t) => t !== tool) : [...prev, tool],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: name.trim(),
        type,
        institution: institution.trim(),
        location: {
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        tools: selectedTools,
        contact: {
          name: contactName.trim(),
          role: contactRole.trim(),
          email: contactEmail.trim(),
        },
      };

      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          throw new Error('Please sign in to register a lab node.');
        }
        if (res.status === 503) {
          throw new Error('Database is not configured on this deployment yet.');
        }
        throw new Error(data.message || data.error || 'Failed to register lab node.');
      }

      setIsSuccess(true);
      onSuccess?.();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-lab-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-canvas/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg border border-hairline bg-surface-2 p-6 shadow-overlay space-y-5">
        <div>
          <h2
            id="register-lab-modal-title"
            className="font-display text-headline-sm text-fg"
          >
            Register an ATL or Makerspace Node
          </h2>
          <p className="mt-1 text-body-sm text-fg-muted">
            Connect your school ATL, university lab, or community makerspace to the Hackerland distributed fabrication network.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-md border border-danger/40 bg-danger/10 p-3 text-body-sm text-danger-fg break-words"
          >
            {error}
          </div>
        )}

        {isSuccess ? (
          <div
            role="status"
            className="rounded-md border border-success/40 bg-success/10 p-4 text-body-sm text-success-fg space-y-2"
          >
            <p className="font-semibold">Lab Node registered successfully!</p>
            <p className="text-fg-muted">
              Your makerspace node has been listed in the directory and is ready to accept squad testbench bookings.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="mt-3 w-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="lab-name" className="block font-display text-label-md text-fg">
                Node Name
              </label>
              <Input
                id="lab-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Atal Tinkering Lab Vellore #042"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="lab-type" className="block font-display text-label-md text-fg">
                  Facility Type
                </label>
                <select
                  id="lab-type"
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                  className="h-11 w-full rounded-sm border border-line bg-sunken px-3 text-body-md text-fg focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent"
                >
                  <option value="atl">Atal Tinkering Lab (ATL)</option>
                  <option value="college">University Makerspace</option>
                  <option value="fablab">Community FabLab</option>
                  <option value="incubator">DeepTech Incubator</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="lab-institution" className="block font-display text-label-md text-fg">
                  Host Institution
                </label>
                <Input
                  id="lab-institution"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Govt HSS Vellore"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label htmlFor="lab-city" className="block font-display text-label-xs text-fg">
                  City
                </label>
                <Input
                  id="lab-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Vellore"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="lab-state" className="block font-display text-label-xs text-fg">
                  State
                </label>
                <Input
                  id="lab-state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Tamil Nadu"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="lab-pincode" className="block font-display text-label-xs text-fg">
                  PIN
                </label>
                <Input
                  id="lab-pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="632001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block font-display text-label-md text-fg">
                Available Tools & Capabilities
              </span>
              <div className="grid grid-cols-2 gap-2">
                {COMMON_TOOLS.map((tool) => (
                  <label
                    key={tool}
                    className="flex items-center gap-2 rounded-sm border border-hairline bg-surface-1 p-2 text-label-xs text-fg font-mono cursor-pointer hover:border-line"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTools.includes(tool)}
                      onChange={() => toggleTool(tool)}
                      className="accent-accent"
                    />
                    <span>{tool}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-hairline">
              <div className="space-y-1">
                <label htmlFor="lab-contact-name" className="block font-display text-label-xs text-fg">
                  Contact In-Charge
                </label>
                <Input
                  id="lab-contact-name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Dr. S. Raman"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="lab-contact-role" className="block font-display text-label-xs text-fg">
                  Role
                </label>
                <Input
                  id="lab-contact-role"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="Lab In-Charge"
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="lab-contact-email" className="block font-display text-label-xs text-fg">
                  Email
                </label>
                <Input
                  id="lab-contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="lab@institution.ac.in"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-hairline">
              <Button
                type="button"
                variant="secondary"
                disabled={isSubmitting}
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isSubmitting}
                disabled={isSubmitting || !name.trim() || selectedTools.length === 0}
              >
                {isSubmitting ? 'Registering...' : 'Register Node'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
