import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Activity, LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <Card className="p-6 bg-gradient-to-r from-primary to-primary-dark text-primary-foreground border-0 shadow-[var(--shadow-medical)]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
          <Shield className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Antishtraf AI</h1>
          <p className="text-primary-foreground/80">Medical Report Audit System</p>
        </div>
        <div className="flex items-center gap-4 text-primary-foreground/80">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            <span className="text-sm">Healthcare Analytics</span>
          </div>
          {user && (
            <div className="flex items-center gap-3 border-l border-white/20 pl-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-primary-foreground hover:bg-white/20 h-8"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};