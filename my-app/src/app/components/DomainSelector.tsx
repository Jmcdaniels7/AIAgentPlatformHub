import { Domain } from '../types';
import { domainConfigs } from '@/app/utils/storage';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface DomainSelectorProps {
  selectedDomain: Domain | null;
  onSelectDomain: (domain: Domain) => void;
}

export function DomainSelector({ selectedDomain, onSelectDomain }: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {domainConfigs.map((config) => (
        <Button
          key={config.id}
          variant={selectedDomain === config.id ? 'default' : 'outline'}
          className="h-auto p-4 flex flex-col items-start gap-2 relative"
          onClick={() => onSelectDomain(config.id)}
        >
          {selectedDomain === config.id && (
            <Check className="w-4 h-4 absolute top-2 right-2" />
          )}
          <div className="text-2xl">{config.icon}</div>
          <div className="text-left">
            <div className="font-semibold text-sm">{config.name}</div>
            <div className="text-xs opacity-70 mt-1 font-normal">
              {config.description}
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
}