import { Card } from '@/components/ui/card';
import { Shield, Activity } from 'lucide-react';

export const Header = () => {
  return (
    <Card className="p-6 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground border-0 shadow-[var(--shadow-medical)]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <Shield className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Antishtraf AI</h1>
          <p className="text-primary-foreground/80">Medical Report Audit System</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-primary-foreground/80">
          <Activity className="h-5 w-5" />
          <span className="text-sm">Healthcare Analytics</span>
        </div>
      </div>
    </Card>
  );
};